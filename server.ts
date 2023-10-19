import express, { Request, Response } from 'express';
import fetch from "node-fetch"
import { v4 } from "uuid"
import { readFileSync } from 'fs'

const config = JSON.parse(readFileSync("./config.json", "utf-8")) as {
  backend_url:string
  auth_url:string
  credentials:{
    username:string
    password:string
  }
}

const AUTHORIZATION_HEADER=`Basic ${btoa(config.credentials.username + ':' + config.credentials.password)}`
    
const app = express();
const port ="8080";

app.use("/static", express.static("dist"))
app.use(express.json())


// example of phase 2 implementation
app.post('/api/start', async (req: Request, res: Response) => {
  const body = req.body
  console.log("/api/start request",body)

  const account_id = v4()
  const request_body = {
    acctId: account_id,
    acctNumber:body.PaymentMethod.Card.PAN.PAN
  }
  console.log("request to backend", request_body)
  const result =  await fetch(config.backend_url,{
    method:"POST",
    body:JSON.stringify(request_body),
    headers: {
      Authorization:AUTHORIZATION_HEADER
    }
  })
  const response_json = await result.json() as any
  console.log("response from backend", response_json)
  response_json.acctId = account_id
  console.log("response from /api/start", response_json)
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response_json));
});

// example of phase 4 implementation
app.post('/api/auth', async (req: Request, res: Response) => {
  const body = req.body

  console.log("/api/auth request",body)
  const threeds_results =  await fetch(body.ResultsUrl,{
    method:"GET",
    headers: {
      Authorization:AUTHORIZATION_HEADER
    }
  }) 
  const threeds_results_body = await threeds_results.json() as {
      acsTransID:string
      authenticationValue:string
      dsTransID:string
      eci:string
      splitSdkServerTransId:string
      threeDSServerTransID:string
      transStatus:string
    }  
  console.log("3ds results  response",threeds_results_body)
  body.payment.PaymentMethod.Card['3DSecure']={
    "AuthenticationValue": threeds_results_body.authenticationValue,
    "ECommerceIndicator": threeds_results_body.eci,
    "3DSecureTransactionID": threeds_results_body.splitSdkServerTransId 
  }
  console.log("Authorization Request",body.payment)
  const result = await fetch(`${config.auth_url}/v0/transaction/auth`,{
    method:"POST",
    body:JSON.stringify(body.payment),
    headers: {
      Authorization:AUTHORIZATION_HEADER,
      "Content-Type":"application/json"
    }
  })
  const response = await result.json()
  console.log("/api/auth response",response)
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(await result.json()))
});

app.get('/', (req: Request, res: Response) => {
  res.redirect("/static/index.html");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
