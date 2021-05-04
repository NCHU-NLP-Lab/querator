# Querator
實驗室的問句生成模型服務
> [A Recurrent BERT-based Model for Question Generation](https://www.aclweb.org/anthology/D19-5821.pdf)

## 主要套件
- fastapi
- react
- transformers

## 前端
請先確定在`react/`底下
> `cd react`
### 指令
- 安裝相依套件(僅第一次需要): `npm install`: 
- 啟動開發環境: `npm run start`
- 編譯APP: `npm run build`

## 後端
### 指令
- )安裝相依套件(僅第一次需要): `pip install -r requirements`
- 啟動開發環境: `uvicorn server:app --reload`
- 部署: `cd react && npm run build && cd .. && uvicorn server:app`
> 部屬階段先確定react有重新build過，再啟動server

## 其他
### GPU支援
**不支援**GPU。作為服務，建議不要占用寶貴的GPU資源

`seq2seq lm`、`causal lm`等架構在CPU運算下的速度是可以接受的

### CORS安全性
預設不開啟，如果有打API需求手動更改
```python
# server.py
allow_origins=["*"]
```
### API文件
請將server運行起來，然後前往`/docs`

### 模型檔案
模型檔案存放於hf model hub，目前有三種模型可供使用
- [bart-squad-qg-hl](https://huggingface.co/p208p2002/bart-squad-qg-hl)
- [gpt2-squad-qg-hl](https://huggingface.co/p208p2002/gpt2-squad-qg-hl)
- [t5-squad-qg-h](https://huggingface.co/p208p2002/t5-squad-qg-hl)

### Todos
- 中文/多語言QG模型
- dockerize