import Web3 from 'web3';
import Crud from '../build/contracts/Crud.json'

let web3;
let crud;

const initWeb3 = () =>{
    return new Promise((resolve, reject)=>{
        if(typeof window.ethereum !== 'undefined'){
            web3 = new Web3(window.ethereum);
            window.ethereum.enable()
            .then(()=>{
                resolve(new Web3(window.ethereum))
            })
            .catch(e=>{
                reject(e);
            });
            return;
        }
        if(typeof window.web3 !== 'undefined'){
            return resolve(
                new Web3(window.web3.currentProvider)
            );
        }
        resolve('http://localhost:9545');
    })
} 

const initContract = () =>{
    const keyDeployement = Object.keys(Crud.networks)[0];
    return new web3.eth.Contract(
        Crud.abi,
        Crud.networks[keyDeployement].address
    )
}

const initApp = () => {
    let accounts = [];
    web3.eth.getAccounts()
    .then(_accounts  => {
        accounts = _accounts; 
    })
    const $createResult = document.getElementById('create-result')
    const $create = document.getElementById('create').addEventListener('submit', e => {
        e.preventDefault()
        const name = e.target.elements[0].value;
        crud.methods.create(name).send({from : accounts[0]})
        .then(()=>{
            $createResult.innerHTML = 'New User added !'
        })
        .catch(()=>{
            $createResult.innerHTML = 'Error on trying to create new user...'
        });
    })

    const $readResult = document.getElementById('read-result')
    const $read = document.getElementById('read').addEventListener('submit', e => {
        e.preventDefault()
        const id = e.target.elements[0].value;
        crud.methods.read(id).call()
        .then((res)=>{
            $readResult.innerHTML = `Id: ${res[0]}, Name : ${res[1]}`;
        })
        .catch((e)=>{
            $readResult.innerHTML = e.message
        });
    })

    const $editResult = document.getElementById('edit-result')
    const $edit = document.getElementById('edit').addEventListener('submit', e => {
        e.preventDefault()
        const id = e.target.elements[0].value;
        const name = e.target.elements[1].value;
        crud.methods.update(id, name).send({ from : accounts[0]})
        .then((res)=>{
            $createResult.innerHTML = `User ${id} has been edited`;
        })
        .catch((e)=>{
            $createResult.innerHTML = e.message
        });
    })

    const $deleteResult = document.getElementById('delete-result')
    const $delete = document.getElementById('delete').addEventListener('submit', e => {
        e.preventDefault()
        const id = e.target.elements[0].value;
        crud.methods.destroy(id).send({ from : accounts[0]})
        .then((res)=>{
            $createResult.innerHTML = `User ${id} has been deleted`;
        })
        .catch((e)=>{
            $createResult.innerHTML = e.message
        });
    })

}

document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
    .then(_web3 => {
        web3 = _web3
        crud = initContract()
        initApp();
    })
    .catch(e=> console.log(e.message))
})