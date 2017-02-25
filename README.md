Ulbora Oauth2 Server 
==============

Ulbora Oauth2 Server is an Oauth2 server implementation build on Node.js. Currently authorization code, 
implicit, and client credentials grant types are supported.

## Authorization Code Grant Type

 * Authorize

```
   Example
   GET:

http://localhost:3000/oauth/authorize?response_type=code&client_id=403&redirect_uri=CALLBACK_URL&scope=read&state=xyz
  
```

```  
   Test
   GET:

http://localhost:3000/oauth/authorize?response_type=code&client_id=403&redirect_uri=http://www.google.com&scope=read&state=xyz

```

 * Access Token 

```
   Example
   POST:

http://localhost:3000/oauth/token?client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&grant_type=authorization_code&code=i76y13e340akRn6Ipkdbii&redirect_uri=http://www.google.com
 
```

```  
   Test
   POST:

http://localhost:3000/oauth/token?client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&grant_type=authorization_code&code=i76y13e340akRn6Ipkdbii&redirect_uri=http://www.google.com

```

 * Refresh Token

```
   Example
   POST:

http://localhost:3000/oauth/token?grant_type=refresh_token&client_id=CLIENT_ID&client_secret=CLIENT_SECRET&refresh_token=REFRESH_TOKEN
   
```

``` 
   Test
   POST:

http://localhost:3000/oauth/token?grant_type=refresh_token&client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&refresh_token=efssffffnnlf

```

## Implicit Grant Type

* Authorize

```
   Example
   GET:

http://localhost:3000/oauth/authorize?response_type=token&client_id=403&redirect_uri=CALLBACK_URL&scope=read&state=xyz
  
```

```  
   Test
   GET:

http://localhost:3000/oauth/authorize?response_type=token&client_id=403&redirect_uri=http://www.google.com&scope=read&state=xyz

```


## Client Credentials Grant Type

 * Access Token    

```
   Example
   POST:

http://localhost:3000/oauth/token?client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&grant_type=client_credentials
 
```

```  
   Test
   POST:

http://localhost:3000/oauth/token?client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&grant_type=client_credentials

```

## Password Grant Type
Currently not supported.



## Access Token Validation


```
   Example
   POST:

http://localhost:3000/rs/token/validate
 
```

```  
   Request:

{
   "userId":null,
   "clientId": 403,
   "role":"admin",
   "url":"http:localhost:3000/rs/updateClient",
   "scope":null,
   "accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhY2Nlc3MiLCJncmFudCI6ImNsaWVudF9jcmVkZW50aWFscyIsImNsaWVudElkIjo0MDMsInJvbGVVcmlzIjpbeyJjbGllbnRSb2xlSWQiOjEsInJvbGUiOiJhZG1pbiIsInVyaUlkIjo2MywidXJpIjoiaHR0cDpsb2NhbGhvc3Q6MzAwMC9ycy91cGRhdGVDbGllbnQiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6MSwicm9sZSI6ImFkbWluIiwidXJpSWQiOjc3LCJ1cmkiOiJodHRwOmxvY2FsaG9zdDozMDAwL3JzL2FkZENsaWVudFNjb3BlIiwiY2xpZW50SWQiOjQwM30seyJjbGllbnRSb2xlSWQiOjIsInJvbGUiOiJ1c2VyIiwidXJpSWQiOjY4LCJ1cmkiOiJodHRwOmxvY2FsaG9zdDozMDAwL3JzL2RlbGV0ZUNsaWVudEFsbG93ZWRVcmkiLCJjbGllbnRJZCI6NDAzfSx7ImNsaWVudFJvbGVJZCI6Miwicm9sZSI6InVzZXIiLCJ1cmlJZCI6ODAsInVyaSI6Imh0dHA6bG9jYWxob3N0OjMwMDAvcnMvYWRkQ2xpZW50Um9sZVVyaSIsImNsaWVudElkIjo0MDN9XSwiZXhwaXJlc0luIjozNjAwMCwiaWF0IjoxNDg3NTUwNTcxLCJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJleHAiOjE0ODc1ODY1NzEsImlzcyI6IlVsYm9yYSBPYXV0aDIgU2VydmVyIn0.1Isnysob52ujgYOu9Oi"
}



```


```  
   Response:

{
  "valid": true
}


```