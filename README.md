# Querator
實驗室的問句生成模型服務
> [A Recurrent BERT-based Model for Question Generation](https://www.aclweb.org/anthology/D19-5821.pdf)

## 主要套件
- fastapi
- react
- transformers

## 服務部屬
```sh
docker-compose up -d --build
```
> 加入參數 `-e allow_origins="*"` 允許全部CORS，或用空白分隔多個

> 預設運行在 port:22500

## 前端
請先確定在`react/`底下
> `cd react`
### 指令
- 安裝相依套件(僅第一次需要): `npm install`: 
- 啟動開發環境: `npm run start`
- 編譯APP: `npm run build`

### 開發與維護
前端開發時有一個獨立的開發服務器，因此需要指定前端開發時有一個獨立的開發服務器，因此需要指定API。
這些操作都透過環境變數來完成
- `REACT_APP_EN_API_SERVER`
- `REACT_APP_CH_API_SERVER`

有時候也需要指定開發服務器的指定開發服務器的PROT
- `PORT`

```sh
PORT=16004 REACT_APP_EN_API_SERVER=http://140.120.13.253:16005/en npm start
```

## 後端
### 指令
- 安裝相依套件(僅第一次需要): `pip install -r requirements.txt`
- 啟動開發環境: `uvicorn server:app --reload`
> 前端必須已經建置，否則會發生錯誤
- 部署: `cd react && npm run build && cd .. && uvicorn server:app`
> 部屬階段先確定react有重新build過，再啟動server

### 開發與維護
後端開發時可以設定允許設定允許CORS，並且指定port與host
> `host`設定為`0.0.0.0`即可
```sh
allow_origins="*" uvicorn server:app --port 16005 --host 0.0.0.0
```
### 路由/API文件
請將server運行起來，然後前往`/docs`查閱完整文檔
#### GET: /
展示/前端首頁
#### GET: /docs
Querator API文件檔案，可線上測試
#### POST: /en/generate-question
Content type: application/json
```json
{
  "article": "Harry Potter is a series of seven fantasy novels written by British author, J. K. Rowling.",
  "answer": {
    "tag": "J. K. Rowling",
    "start_at": 76,
    "end_at": 88
  }
}
```

#### POST: /zh/generate-question
Content type: application/json
```json
{
  "article": "英國作家J·K·羅琳的兒童奇幻文學系列小說，描寫主角哈利波特在霍格華茲魔法學校7年學習生活中的冒險故事；該系列被翻譯成75種語言",
  "answer": {
    "tag": "冒險故事",
    "start_at": 47,
    "end_at": 50
  }
}
```

## 其他
### GPU支援
**不支援**GPU。作為服務，建議不要占用寶貴的GPU資源

`seq2seq lm`、`causal lm`等架構在CPU運算下的速度是可以接受的

### CORS安全性
預設不開啟，如果有打API需求設置環境變數
```sh
export allow_origins="*" # 允許全部
```
> 可用空白分隔多個: `"http://HOST_1 http://HOST2"`

### 模型檔案
模型檔案存放於hf model hub
- [t5-squad-qg-hl](https://huggingface.co/p208p2002/t5-squad-qg-hl)
- [gpt2-drcd-qg-hl](https://huggingface.co/p208p2002/gpt2-drcd-qg-hl)
