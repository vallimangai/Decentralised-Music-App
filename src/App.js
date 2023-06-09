import React,{ useState, useEffect} from "react";
import Counter from "./contracts/Music.json";
import Web3 from 'web3'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import { Alert } from 'react-alert'


import './App.css';



function App(){
  const [title,settitle] = useState("");
  const [link,setlink] = useState("");
  const [royalty, setroyalty] = useState(0);
  const [artist,setartist] = useState("");
  const [distributor,setdistributor] = useState("");
  const [amount,setamount] = useState(0);
  const [songs,setsongs] = useState([]);
  const [contract,setContract]=useState(null);
  const[account,setAccount]=useState("");
  const setTitle = (event) =>{
    settitle(event.target.value);
    
  }
  const setLink = (event) =>{
    setlink(event.target.value);
  }
  const setRoyalty = (event) =>{
    setroyalty(event.target.value);
  }
  const setArtist = (event) =>{
    setartist(event.target.value);
  }
  const setDistributor = (event) =>{
    setdistributor(event.target.value);
  }
  const setAmount = (event) =>{
    setamount(event.target.value);
  }
  useEffect(() => {
    const init = async () => {
      try {
        const ganacheProvider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
        const web3Instance = new Web3(ganacheProvider);

        // const chainId=await web3Instance.eth.getChanId();
        // console.log("Chain ID: ",chainId);

        const accounts = await web3Instance.eth.getAccounts();
        console.log("Accounts:",accounts);
        setAccount(accounts[0]);

        const networkId= await web3Instance.eth.net.getId();
        const deployedNetwork= Counter.networks[networkId];
        const counterContract = new web3Instance.eth.Contract(
            Counter.abi,
            deployedNetwork && deployedNetwork.address,
        );
        await setContract(counterContract);

        console.log("Accounts:",accounts);

        const newCount=await counterContract.methods.getAllTracks().call();
        const l=[]
      
        for(let i=0;i<newCount.length;i++){
          l.push(newCount[i]['title']);
        }
        setsongs(l);
      }
      catch(error){
        console.log(error);
      }
  };
  init();
  }, []);
  
  const addMusic = async() => {
    try{
      // console.log(rCount);
      await contract.methods.addTrack(title,link,artist,distributor,parseInt(royalty)).send({ from: account, gas: '1000000'});
      const newCount = await contract.methods.getAllTracks().call();
      console.log(newCount);
      allSongs();
      alert("Successfully Added");
      settitle("");
      setlink("");
      setroyalty(0);
      setartist("");
      setdistributor("");
      setamount(0);

    }catch(error){
      
      console.log(error);
    }
  };
  const allSongs = async() =>{
    try{
      // console.log(rCount);
      const newCount = await contract.methods.getAllTracks().call();
      const l=[]
      for(let i=0;i<newCount.length;i++)
        l.push(songs[i]['title']);
      setsongs(l);
      
    }catch(error){
      console.log(error);
    }
  }
 
  const playMusic = async(n) =>{
    try{
      // await contract.methods.playTrack(0).send({ from: account, gas: '1000000',value:Web3.utils.toWei(amount)})
      const t= await contract.methods.displayTrackDetails(n).call();
      console.log(t['4'],"<=",amount)
      if(t['4']<=amount){
      const t1=await contract.methods.playTrack(n).send({ from: account, gas: '1000000',value:Web3.utils.toWei(amount)}).then(async(result) => {
        
          
         const audioElement = new Audio("http://127.0.0.1:8281/ipfs/"+t['1']);
         audioElement.play();
     

        console.log("Was successful: "+result.arg);
        }).catch((err) => {
          alert("Insufficent Royalty Fee");
          console.log("Failed with error: " + err);
        });
      }
    else{
      alert("Insufficent Royalty Fee");
    }
  }catch(error){
      console.log("error");
      alert(error);
      console.log(error);
    }
  };
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={
        <div class="all">
          <div>
            <ul>
              <li><a href="/" className="active">All songs</a></li>
              <li><a href="/addSongs">Add Songs</a></li>
              <li style={{"float":"right"}}>Smart Music App</li>
            </ul>
          </div>
          <br></br>
          <br></br>
          <div class="allsong">
            <Row>
              {
                songs.map((s,id) =>(
                  <Col>
                  <Card>
                  <CardText tag='h2' style={{"color":"mediumspringgreen"}}>{s}</CardText>
                  <input type="text" class="txt" placeholder="royalty fee" onChange={setAmount} style={{"width": "80%","margin":"8px 16px"}}></input>
                  <br></br>
                  {console.log(id)}
                  <button onClick={()=>playMusic(id)}>Play</button>
                </Card>
                </Col>
                
              ))}
              
            </Row> 
          </div> 
        </div>    
       }/>
      <Route path="addSongs" element={
        <div class="all">
          <div>
            <ul>
              <li><a href="/" >All songs</a></li>
              <li><a href="/addSongs" className="active">Add Songs</a></li>
              <li style={{"float":"right"}}>Smart Music App</li>
            </ul>
          </div>
          <br></br>
          <div className="formSong">
           Title: <input type="text" onChange={setTitle} value={title}></input> <br></br>
           Link:  <input type="text" onChange={setLink} value={link}></input> <br></br>
           Artist Address: <input type="text" onChange={setArtist} value={ artist}></input><br></br>
           Distributor Address:<input type="text" onChange={setDistributor}value={distributor}></input><br></br>
           Royalty Fee: <input type="text" onChange={setRoyalty} value={royalty}></input><br></br>
             <button onClick={addMusic}>Submit</button><br></br>
          </div>
        </div>
        }/>
        
      </Routes>
    </BrowserRouter>
   
  ); 
}
export default App;
