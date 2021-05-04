# Querator
## 前端
請先確定在`react/`底下
> `cd react`
### 指令
- 安裝相依套件(僅第一次需要): `npm install`: 
- 啟動開發環境: `npm run start`
- 編譯APP: `npm run build`

## 後端
### 指令
- 安裝相依套件(僅第一次需要): `pip install -r requirements`
- 啟動開發環境: `uvicorn server:app --reload`
- 部署: `cd react && npm run build && cd .. && uvicorn server:app`
> 部屬階段先確定react有重新build過，再啟動server