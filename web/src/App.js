import React, {useEffect, useState} from 'react';
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };


  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );


  const renderInputForm = () =>{
		return (
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={name}
						placeholder='Enter your name..'
						onChange={e => setName(e.target.value)}
					/>
				</div>

				<input
					type="text"
					value={details}
					placeholder='Tell us about yourself..'
					onChange={e => setDetails(e.target.value)}
				/>

				<div className="button-container">
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Mint
					</button>  
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Set data
					</button>  
				</div>

			</div>
		);
	}
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">Proof of Protocol</p>
              <p className="subtitle">Make you presence on-chain</p>
              <p>Current Address: {currentAccount}</p>
            </div>
          </header>
        </div>
        
        {!currentAccount && renderNotConnectedContainer()}
        {currentAccount && renderInputForm()}
        <div className="footer-container">
           <p>Made with ❤️ by POP Team</p>
        </div>
      </div>
    </div>
  );
};

export default App;