import React, {useState, useContext} from 'react';

import './styles.css';


import { Context } from '../../Contexts/AuthProvider'
import api from "../../services/api"


export default function Reader(){

    let pages = []
    const { token, loading, handleLogin } = useContext(Context)
    const [currentPage, setCurrentPage] = useState({id: 0, path: ""});  
    
    let config = {
        headers: {
            'Authorization': `Bearer ${token}`
          }
    }

    async function componentDidMount() {
        //registerToSocket();
      
        console.log(token)     
        
        api.get('chapter/index?manga_id=60b809c8f2e54b2be09ec686&number=1', config).then(response => {
            //setState({ feed: response.data });  
           

            if(response.data !== null){
                console.log(response.data);
                response.data.forEach(page =>{
                    pages.push(page.url)
                })
    
                setCurrentPage({id: 0, path: pages[0]})
                console.log("list chapters well succeed")
            } else {
                console.log("list chapters failed")

            }

           
           
        }).catch(err =>{
            console.log(err)
            console.log("list chapters failed")
        })
      
    }
    componentDidMount()
    
    
    var imagePath = [];
    /*
    function generatePath(someImageName) {
        return require(`../../assets/${someImageName}`);
    }

    function getPaths(){
        let temp = [ {
            id: 0,
            path: generatePath("banner_scan.png")
        }];

        for(var i = 1; i < 49; i++){
            if (i < 10){
                temp.push({
                    id: i, 
                    path: generatePath(`cap/0${i}.jpg`)
                   
                });                
            }               
            else {
                temp.push({
                    id: i, 
                    path:  generatePath(`cap/${i}.jpg`)
                })
            }
        imagePath = temp
        }
    }
              */     
    
    function nextPage(){    
        if (currentPage.id === pages.length){
            console.log("last page reached")
        } else{
            setCurrentPage({id: currentPage.id+1, path: pages[currentPage.id+1]})
        }
        

        
    }

    function prevPage(){    
        if(currentPage.id === 0){
            console.log("first page reached")
        } else{
            setCurrentPage({id: currentPage.id-1, path: pages[currentPage.id-1]})
        }
        
     
    }

    return <>   
        <div className="reader">
            <div className="header-board">

                    <div className="title">
                        Rental Onii-chan!
                    </div>
                    <div className="controllers">
                        <button className='button'>◄◄</button>
                        <div className="chapters"> Chapter #06 </div>
                        <button className='button'>►►</button>
                   
                   
                    </div>
                    <div className="controllers">
                        <button className='button' onClick= {() => prevPage()}>prev</button>
                        <div className="pages-list"></div>
                        <div className="version"></div>
                        <div className="viewToggle"></div>
                        <button className='button' onClick={() => nextPage()}>next</button>
                   
                   
                    </div>
            </div>



            <div className='board'>       


                <img className='page' src={currentPage.path} alt={currentPage.id} onClick={() => nextPage()}/>
            </div>


        </div>
      
        

    </>
}