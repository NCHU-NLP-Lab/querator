let defaultState = {
    appToken:window.localStorage.getItem('appToken')||'',
    isLoging:false,
    selectWords: [],
    selectWordsRaw:[],
    selectWordsSubmitting: false,
    showSetting: false,
    lng: 'zh-TW',
    model: 'zh-TW',
    lastSubmitArticle: '',
    pickAnsRaw: [],    
    fullContext: '',
    submitCount:0,
    submitTotal:0,
    showTextSlider:false
}

// let defaultState = JSON.parse('{"selectWords":[{"end_at":129,"question":["賓士首輛5+2座跨界車款名為什麼?","賓士首輛5+2座跨界車款是哪一個車型?","賓士首輛5+2座跨界車款是哪一個?","賓士首輛5+2座跨界車款名為?"],"start_at":127,"tag":"GLB","softDel":false},{"end_at":19,"question":["法蘭克福車展在哪一年正式開幕?","法蘭克福車展在哪一年舉辦?","法蘭克福車展於哪一年正式開幕?","法蘭克福車展在哪一年舉行?","法蘭克福車展於哪一年舉辦?"],"start_at":16,"tag":"2019","softDel":false}],"selectWordsRaw":[{"end_at":129,"question":["賓士首輛5+2座跨界車款名為什麼?","賓士首輛5+2座跨界車款是哪一個車型?","賓士首輛5+2座跨界車款是哪一個?","賓士首輛5+2座跨界車款名為?"],"start_at":127,"tag":"GLB","softDel":false},{"end_at":19,"question":["法蘭克福車展在哪一年正式開幕?","法蘭克福車展在哪一年舉辦?","法蘭克福車展於哪一年正式開幕?","法蘭克福車展在哪一年舉行?","法蘭克福車展於哪一年舉辦?"],"start_at":16,"tag":"2019","softDel":false}],"selectWordsSubmitting":false,"showSetting":false,"lng":"zh-TW","model":"zh-TW","lastSubmitArticle":"","pickAnsRaw":[{"tag":"2019","start_at":16,"end_at":19,"context":"兩年一度的法蘭克福車展（IAA 2019）可說是全世界最具指標意義的車界盛事，這次我們再度來到現場採訪，藉此觀察汽車業的未來趨勢；車展正式開幕前，已有許多汽車品牌預告推出多款重量級產品，以 Mercedes-Benz 為例，包括全新 NGCC 家族成員 GLB，是賓士首輛5+2座跨界車款，以及造型流線帥氣的 GLE Coupe、純電動MPV車款EQV、純電動都會小車 EQ Smart 等；由此可見「電動化」就是本屆法蘭克福車展的觀展重點，就讓我帶大家一起來看有哪些新奇有趣的吧！"},{"tag":"GLB","start_at":127,"end_at":129,"context":"兩年一度的法蘭克福車展（IAA 2019）可說是全世界最具指標意義的車界盛事，這次我們再度來到現場採訪，藉此觀察汽車業的未來趨勢；車展正式開幕前，已有許多汽車品牌預告推出多款重量級產品，以 Mercedes-Benz 為例，包括全新 NGCC 家族成員 GLB，是賓士首輛5+2座跨界車款，以及造型流線帥氣的 GLE Coupe、純電動MPV車款EQV、純電動都會小車 EQ Smart 等；由此可見「電動化」就是本屆法蘭克福車展的觀展重點，就讓我帶大家一起來看有哪些新奇有趣的吧！"}],"fullContext":"兩年一度的法蘭克福車展（IAA 2019）可說是全世界最具指標意義的車界盛事，這次我們再度來到現場採訪，藉此觀察汽車業的未來趨勢；車展正式開幕前，已有許多汽車品牌預告推出多款重量級產品，以 Mercedes-Benz 為例，包括全新 NGCC 家族成員 GLB，是賓士首輛5+2座跨界車款，以及造型流線帥氣的 GLE Coupe、純電動MPV車款EQV、純電動都會小車 EQ Smart 等；由此可見「電動化」就是本屆法蘭克福車展的觀展重點，就讓我帶大家一起來看有哪些新奇有趣的吧！","submitCount":2,"submitTotal":2}')

const AppState = (state = defaultState, action) => {
    console.log(action)
    switch (action.type) {
        case 'SHOW_TEXT_SLIDER':
            return Object.assign({},state,{
                showTextSlider:action.show
            })
        case 'USER_LOGIN':
            return Object.assign({},state,{
                appToken:action.token
            })
        case 'USER_LOGINING':
            return Object.assign({},state,{
                isLoging:action.loging
            })
        case 'SETTING_LNG_AND_MODEL':
            if (action.lng === 'NULL')
                action.lng = state.lng
            if (action.model === 'NULL')
                action.model = state.model
            return Object.assign({}, state, {
                lng: action.lng,
                model: action.model
            })

        case 'SUBMIT_START':
            return Object.assign({}, state, {
                selectWordsSubmitting: true,
                fullContext: action.fullContext,
                submitCount:0,
                submitTotal:action.submitTotal
            })
        
        case 'SUBMIT_ADD_COUNT':
            return Object.assign({},state,{
                submitCount:state.submitCount+1
            })

        case 'SUBMIT_QUESTIONS':
                action.questions = action.questions.map((q)=>{
                    return Object.assign({},q,{
                        softDel:false
                    })
                })
            return Object.assign({}, state, {
                selectWordsSubmitting: false,
                selectWords: action.questions,
                selectWordsRaw: [...action.questions],
                pickAnsRaw: action.pickAnsRaw,

            })

        case 'SUBMIT_QUESTIONS_FAIL':
            return Object.assign({}, state, {
                selectWordsSubmitting: false,
                selectWords: action.questions,                
            })

        case 'UPDATE_QUESTION':
            return Object.assign({}, state, {
                selectWords: action.questions,
            })
        
        case 'DEL_OR_RECOVERY_ANSWER':
            var newSelectWords = [...state.selectWords]            
            newSelectWords = newSelectWords.map((w)=>{
                let { tag:at, start_at:as, end_at:ae } = action.targetInfo
                let { tag:wt, start_at:ws, end_at:we } = w
                let actionTarget = at+as+ae
                let stateTarget = wt+ws+we
                if(actionTarget === stateTarget){
                    return Object.assign({},w,{
                        softDel:!w.softDel
                    })
                }
                return w
            })
            return Object.assign({},state,{
                selectWords:newSelectWords
            })

        case 'APP_SHOW_SETTING':
            let { show } = action
            return Object.assign({}, state, {
                showSetting: show
            })

        default:
            return state
    }
}

export default AppState