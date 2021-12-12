ALL API of User Service; PORT 3001; 

- Sign Up: http://localhost:3001/api/user, METHOD: POST , KEY: email,password,confirmPassword
- Login : http://localhost:3001/api/user/login, METHOD: POST , KEY: email,password
- Get user information: http://localhost:3001/api/user/info, METHOD: GET , HEADER: Authorization: Bearer ACESS_TOKEN
- Give OTP to your Email: http://localhost:3001/api/user/forgot-password, METHOD: POST, KEY: email
- Reset your password: http://localhost:3001/api/user/reset-password, METHOD: PUT , KEY: opt,email,newPassword,confirmPassword


POST SERVICE: PORT 3002;

- Post create http://localhost:3002/api/post 

TOPIC SERVICE: PORT 3004;

- 

QUERY (main DB): PORT 3003;

- Get one Post: http://localhost:3003/api/posts