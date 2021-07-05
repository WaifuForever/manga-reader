const mongoose = require('mongoose');
const fs = require('fs');
const CryptoJs = require("crypto-js");

const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');


const { getMessage } = require("../common/messages")

const projection = {
    0 : {
        title: 1,
        number: 1,
        views: 1
    },
    1 : {
        updatedAt: 1,
        createdAt: 1,
        title: 1,
        number: 1,  
        visualizations: 1,     
        __v: 1,
        views: 1
    },
    2 : { 
       
        title: 1,
        number: 1,
        views: 1
       
                 
    },
    3 : {       
        title: 1,
        number: 1,
        imgCollection: 1,
        views: 1

      
    }
}

module.exports = {
    async store(req, res){
    
        const { manga_title, number, chapter_title } = req.body;

        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

       
       
        Manga.findOne({title: manga_title}, function (err, manga){ 
            if(manga){          
                Chapter.exists({manga_id: manga._id, number: number}).then(exists=>{
                    if(exists){
                        Object.keys(req.files).forEach((i) => {
                            let file = req.files[i];   
                            fs.unlinkSync('uploads/' + manga.title + "/" + number + "/" + file.filename)    
                            
                        });
                        return res.jsonBadRequest(null, getMessage("chapter.error.duplicate"), new_token)
                    } else {
                        let jsonString = [];         
                
                        Object.keys(req.files).forEach((i) => {
                            let file = req.files[i];
                            console.log(i)
                            
                            let temp = { 
                                originalname:  file.originalname,
                                size: file.size,
                                filename: file.filename,
                                        
                            }                            
                        
                            jsonString.push(JSON.parse(JSON.stringify(temp)));
                            
                        });

                        

                        const chapter = new Chapter({                    
                            manga_id: manga._id,
                            number: number,
                            title: chapter_title,
                            imgCollection: [
                                    
                            ],
                        });

                        chapter.imgCollection = jsonString;

                    
                    
                        chapter.save().then(result => {
                            manga.chapters.push(result._id) 
                            manga.save().then(answer => {                       

                                return res.jsonOK(result, getMessage("chapter.upload.success"), new_token)

                            }).catch(err =>{
                                Chapter.deleteOne({_id: result._id});
                                Object.keys(req.files).forEach((i) => {
                                    let file = req.files[i];   
                                    fs.unlinkSync('uploads/' + manga.title + "/" + number + "/" + file.filename)    
                                    
                                });
                                console.log(err)

                                return res.jsonServerError(null, null, err)
                                
                            });
                            
                        
                            
                        
                        }).catch(err => {
                            Object.keys(req.files).forEach((i) => {
                                let file = req.files[i];   
                                fs.unlinkSync('uploads/' + manga.title + "/" + number + "/" + file.filename)    
                                
                            });
                            console.log(err)
                            return res.jsonServerError(null, null, err)
                    
                        });
                    }
                })
                    
                

            } else{

                let dir = 'uploads/' + manga_title

                fs.rmdir(dir, { recursive: true }, (err) => {
                    if(err){
                        console.log(err)
                    }
                                  
                    
                });

                fs.rmdirSync(dir, {recursive: true})
                  
                /*Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];
                    fs.unlinkSync('uploads/' + manga_title + "/" + number + "/" + file.filename)
                    
                });*/
                return res.jsonNotFound(null, getMessage("manga.notfound"), new_token)                
            }
        });         
    },


    async update(req, res){        

        const { title, number, chapter_id } = req.body;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null
        
        const chapter = await Chapter.findById(chapter_id);
     
        if(!chapter){
            return res.jsonNotFound(null, getMessage("chapter.notfound"), new_token)
        }
  
        let manga = await Manga.findById(chapter.manga_id)
        if(!manga){
            return res.jsonNotFound(null, getMessage("manga.notfound"), new_token)
        } 

        if(manga.scan_id.toString() === CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))){
            manga = null
            if(number){
                chapter.number = number;
            }
            if(title){
                chapter.title = title;
            }
            
            chapter.updatedAt = Date.now()                
            let changes = chapter.getChanges()
            chapter.save().then(answer => {  
                return res.jsonOK(changes, getMessage("chapter.update.success"), new_token)

            }).catch(err => {
                return res.jsonServerError(null, null, err)
            })
            
                    
        } else{
            return res.jsonUnauthorized(null, null, null);
        }
                    
        
    },
   
    async index(req, res){
        const {chapter_id} = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

        
        Chapter.findById(chapter_id).select(projection[3]).then(doc=>{
            console.log(typeof doc.views)
            console.log(doc.views)
            doc.views = doc.views + 1
            doc.save().then(() => {                       
                return res.jsonOK(doc, getMessage("chapter.index.success"), new_token)                      

            }).catch(err =>{
                console.log(err)
                return res.jsonOK(doc, getMessage("chapter.index.success"), new_token)
                
            });
                        
        }).catch(err =>{
            return res.jsonBadRequest(err, null, null) 

        })
        

    },

    async list(req, res){

        const { manga_id } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

        let role;
        
        if (req.role){
            role = CryptoJs.AES.decrypt(req.role, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))            
            req.role = null
        }else{
            role = 0;
        }
       
        console.log("Role: " + role)
      
             
        let docs = []
       
        if (manga_id){
        
            Chapter.find({manga_id: manga_id}).select(projection[role]).then(result=>{
                result.forEach(doc =>{
                    docs.push(doc)
                    
            })                    
            if (docs.length === 0){
                return res.jsonNotFound(docs, getMessage("chapter.list.empty"), new_token) 
            } else{
                return res.jsonOK(docs, getMessage("chapter.list.success"), new_token) 
            }          
                    

            }).catch(err =>{
                return res.jsonBadRequest(err, null, null) 
    
            })
            
        }
          
        else{
            return res.jsonBadRequest(null, null, null) 

        }
      
               
    },

    async delete(req, res){        
        const { manga_id, chapter_id } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

        Chapter.findById(chapter_id).then( chapter => {
            cloneData = []
            //get the deleted chapter index in order to exclude it from chapters array inside manga object
            Manga.findOne({ _id: manga_id }, function (err, manga){ 
                if(manga){
                   
                    cloneData = manga.chapters.filter(function (chap_id){
                        
                        return chap_id.toString() !== chapter_id.toString()
                          
                    })                    
                   
                    Chapter.deleteMany( { manga_id: manga_id, _id: chapter_id }).then(chapters =>{
                        console.log(chapters)
                        if (chapters.n === 0 ){//chapter could not be found
                            return res.jsonNotFound({removed: false}, getMessage("chapter.notfound"), new_token) 
                            
                        } else{
                            manga.chapters = cloneData
                            manga.save().then(result => {  
                                
                                try{                                         
                                    chapter.imgCollection.forEach(function (file){
                                        fs.unlinkSync('uploads/' + manga.title + "/" + chapter.number + "/" + file.filename)   
                                    });
                        
                                } catch(err) {
                                    return res.jsonServerError({ removed: true }, getMessage("chapter.delete.error"), null)
                                } 

                                return res.jsonOK({ removed: true, chapters: chapters }, getMessage("chapter.delete.success"), new_token)
                                          
                            }).catch(err => {
                                console.log(err)
                                return res.jsonServerError(null, null, err)
                            
                            });                
                        }
                    }).catch(err=>{
                        return res.jsonBadRequest(err, null, null)                
                    });                    
                } else{                       
                    return res.jsonNotFound({removed: false}, getMessage("manga.notfound"), new_token) 
                }                               
            });           

        }).catch(err=>{
            return res.jsonBadRequest(err, null, null)
            
        });                
    }
}