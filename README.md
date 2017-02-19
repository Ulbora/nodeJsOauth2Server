Ulbora Oauth2 Server 
==============

## Authorization Code Grant Type

 * Authorize

```
   Example

http://localhost:3000/oauth/authorize?response_type=code&client_id=403&redirect_uri=CALLBACK_URL&scope=read&state=xyz
  
```

```  
   Test

http://localhost:3000/oauth/authorize?response_type=code&client_id=403&redirect_uri=http://www.google.com&scope=read&state=xyz

```

 * Access Token 

```
   Example

http://localhost:3000/oauth/token?client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&grant_type=authorization_code&code=i76y13e340akRn6Ipkdbii&redirect_uri=http://www.google.com
 
```

```  
   Test

http://localhost:3000/oauth/token?client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&grant_type=authorization_code&code=i76y13e340akRn6Ipkdbii&redirect_uri=http://www.google.com

```

 * Refresh Token

```
   Example

http://localhost:3000/oauth/token?grant_type=refresh_token&client_id=CLIENT_ID&client_secret=CLIENT_SECRET&refresh_token=REFRESH_TOKEN
   
```

``` 
   Test

http://localhost:3000/oauth/token?grant_type=refresh_token&client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&refresh_token=efssffffnnlf

```

## Implicit Grant Type

* Authorize

```
   Example

http://localhost:3000/oauth/authorize?response_type=token&client_id=403&redirect_uri=CALLBACK_URL&scope=read&state=xyz
  
```

```  
   Test

http://localhost:3000/oauth/authorize?response_type=token&client_id=403&redirect_uri=http://www.google.com&scope=read&state=xyz

```



 * Client Credentials Grant Type

```
   Example

http://localhost:3000/oauth/token?client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&grant_type=client_credentials
 
```

```  
   Test

http://localhost:3000/oauth/token?client_id=403&client_secret=554444vfg55ggfff22454sw2fff2dsfd&grant_type=client_credentials

```

