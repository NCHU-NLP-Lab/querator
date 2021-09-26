# QG React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

- Querator AI Core : [Harry Chan](https://github.com/Harry-Chan)
- Querator Web Develop : [Philip Huang](https://github.com/p208p2002)

## Introduce QG Web

### Easy to use with only three step

![qg0](<https://raw.githubusercontent.com/p208p2002/drive/master/drive/qg_doc%20(1).png>)

### Step 1 Input any document

![qg1](<https://raw.githubusercontent.com/p208p2002/drive/master/drive/qg_doc%20(1).gif>)

### Step 2 Generate questions

![qg2](<https://raw.githubusercontent.com/p208p2002/drive/master/drive/qg_doc%20(2).gif>)

### Step 3 Review questions

![qg3](<https://raw.githubusercontent.com/p208p2002/drive/master/drive/qg_doc%20(3).gif>)

## Runtime require

- node : 10.16.3
- npm : 6.9.0

## First use

```
npm install
```

## Build ENV

```
export REACT_APP_CH_API_SERVER=http://140.120.13.249:3001
export REACT_APP_EN_API_SERVER=http://140.120.13.249:3002
export REACT_APP_USER_AUTH=[FALSE|TRUE]
export REACT_APP_USER_AUTH_SERVER=http://140.120.13.243:6500/api
```

- REACT_APP_USER_AUTH: 是否需要登入認證
- REACT_APP_USER_AUTH_SERVER: 使用者認證伺服器

## CMD

- `npm start` : 啟動開發環境
- `npm run start-lt` : 在 Port 3003 啟動開發環境
- `npm run build` : Build
- `npm run build4exp` Build for QG_Express
  > 直接 Build & 更新 QG_Express/public 資料
