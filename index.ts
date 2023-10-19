import { util } from './lib'
import * as cc from 'currency-codes'

async function run(){
  const data = {
    "Amount": {
      "Total": '12.00',
      "Tax": 0.25,
      "Currency": "USD"
    },
    "PaymentMethod": {
      "Card": {
          "CVC": {
              "CVC": "212"
          },
          "CardPresent": true,
          "PAN": {
              "PAN": "",
              "ExpMonth": "",
              "ExpYear": ""
          }
      }
    },
    "POS": {
      "EntryMode": "manual",
      "Type": "pos",
      "Device": "Fake test JSON",
      "DeviceVersion": "0.0",
      "Application": "PaynetworxTest",
      "ApplicationVersion": "0.0",
      "Timestamp": "2020-03-03T17:01:44"
    }
  }
  const start_result = await fetch("/api/start",{
    method:"POST",
    body:JSON.stringify(data),
    headers:{
      "Content-Type":"application/json"
    }
  })
  const start_body = await start_result.json() 
  const authenticateSpec: AuthenticateSpec = {
      userId: "test",
      cardId: util.uuidv4(),
      orderId: util.uuidv4(),
      exchangeTransactionDetailsUrl: start_body.TransactionDetailUrl,
      transactionResultUrl: start_body.TransactionResultUrl,
      iframeRef: document.getElementById('3ds-iframe') as HTMLIFrameElement,
      splitSdkServerUrl: "https://meter.threedsv2-qa.paynetworx.net",
      merchantAuthInfo:start_body.AuthToken,
      threeDsData: new ThreeDsData()
        .messageCategory("01")
        .threeDSRequestorAuthenticationInd("01")
        .acctNumber(data.PaymentMethod.Card.PAN.PAN)
        .email("john@paynetworx.com")
        .purchaseDate(util.Now())
          .acctID(start_body.acctId)
          .threeDSRequestorURL(window.location.href)
          .purchaseAmount((parseFloat(data.Amount.Total as string)*Math.pow(10, cc.code(data.Amount.Currency).digits)).toString())
          .purchaseCurrency(cc.code(data.Amount.Currency).number)
          .purchaseExponent(cc.code(data.Amount.Currency).digits.toString())
  };
  const usdk = new ShellThreeDS2Service();
  const initializeSpec = new InitializeSpec();

  await new Promise<void>((res,rej)=>{
    const initializeCallback = {
        onSuccess: function () {
            console.log('uSDK has been successfully initialized!');
            res()
        },
        onFailure: function (error: any) {
            console.log('Failed to initialize uSDK! Error: ', error);
            rej()
        }
    }
    usdk.initialize(initializeSpec, initializeCallback);
  })
  await new Promise((res,rej)=>{
    usdk.authenticate(authenticateSpec, {
        authenticated: function (authenticationResult:any) {
            console.log('authenticated successfully! authenticationResult: ', authenticationResult);
            res(authenticationResult)
        },
        notAuthenticated: function (authenticationResult:any) {
            console.log('not authenticated! authenticationResult: ', authenticationResult);
            res(authenticationResult)
        },
        decoupledAuthBeingPerformed: function (authenticationResult:any) {
            console.log('decoupled authentication being performed! authenticationResult: ', authenticationResult);
            res(authenticationResult)
        },
        cancelled: function (authenticationResult:any) {
            console.log('authentication cancelled! authenticationResult: ', authenticationResult);
            rej(authenticationResult)
        },
        error: function (authenticationResult:any) {
            console.log('authentication erred! authenticationResult ', authenticationResult);
            rej(authenticationResult)
        }
    });
  })
  await fetch("/api/auth",{
    method:"POST",
    body:JSON.stringify({
      ResultsUrl:start_body.ResultsUrl, 
      payment:data
    }),
    headers:{
      "Content-Type":"application/json"
    }
  })
}
window.addEventListener("load",()=>{
  run()
})
