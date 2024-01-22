import { util } from './lib'
import * as cc from 'currency-codes'

async function run(){
  const data = {
    "Amount": {
      "Total": '10.00',
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
      splitSdkServerUrl: "<fill in>",
      merchantAuthInfo:start_body.AuthToken,
      threeDsData: new ThreeDsData()
        .messageCategory("01")
        .threeDSRequestorAuthenticationInd("01")
        .acctNumber(data.PaymentMethod.Card.PAN.PAN)
        .email("test@example.com")
        .purchaseDate(util.Now())
          .acctID(start_body.acctId)
          .threeDSRequestorURL(window.location.href)
          .purchaseAmount((parseFloat(data.Amount.Total as string)*Math.pow(10, cc.code(data.Amount.Currency).digits)).toString())
          .purchaseCurrency(cc.code(data.Amount.Currency).number)
          .purchaseExponent(cc.code(data.Amount.Currency).digits.toString())
          .cardExpiryDate("2901")
          .billAddrCountry("840")
          .billAddrCity("Roswell")
          .billAddrState("GA")
          .billAddrPostCode("74432")
          .billAddrLine1("3493 Camel Back Road")
          .shipAddrCountry("840")
          .shipAddrCity("Roswell")
          .shipAddrState("GA")
          .shipAddrPostCode("74432")
          .shipAddrLine1("3493 Camel Back Road")
          .cardholderName("john doe")
          .mobilePhone({
            cc:"1",
            subscriber:"9186189931"
          })
          .homePhone({
            cc:"1",
            subscriber:"9186189931"
          })
          .workPhone({
            cc:"1",
            subscriber:"9186189931"
          })
          .transType("01")
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
