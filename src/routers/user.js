const express = require('express');
const multer = require('multer')
const sharp = require('sharp')
const User = require('../db/models/user')
const auth = require('../middlewares/auth')
const {sendWelcomeEmail, cancelAccount} = require('../emails/account')
const router = new express.Router();


//profile image handling routes
const upload = multer({
    limits: {
        fileSize: 1000000 // allowed to upload upto 1 Mb file
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return cb(new Error('files must be an image'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar',auth, upload.single('avatar'),async(req,res)=> {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=> {
    res.status(400).send({error: error.message})
})
// deleting the avatar
router.delete('/users/me/avatar',auth,async(req,res)=> {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})





// users routes handlers

router.post('/users', async (req,res)=> {
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
         res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})
// router for log in
router.post('/users/login', async(req,res)=> {
    try{
        const user = await User.findByCreditionals(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async(req,res)=> {
    try{
        req.user.token = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
// logout from all sessions
router.post('/users/logoutAll',auth, async(req,res)=> {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.get('/users/me', auth, async (req,res)=> {
    res.send(req.user)
})


// update 
router.patch('/users/me',auth,async (req,res)=> {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation) {return res.status(400).send({error:'Invalid updates'})}
    try{
        updates.forEach(update=> req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async(req,res)=> {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user) {return res.status(404).send()}
        await req.user.remove()
        cancelAccount(req.user.email,req.user.name )
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/:id/avatar',async(req,res)=> {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports=router;