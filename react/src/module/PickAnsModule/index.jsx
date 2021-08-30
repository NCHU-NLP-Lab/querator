import React, { Component } from 'react';
import './index.css'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { submitQs as SQs } from '../action.js'
import { showToastInfo } from '../toast.js'
import { MdHelp, MdLockOutline, MdLockOpen } from 'react-icons/md';
import { withTranslation } from 'react-i18next';
import { MdRefresh } from "react-icons/md";

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectWords: [],
            isEdit: true,
            inputContext:'',
            // inputContext: 'Harry Potter is a series of seven fantasy novels written by British author, J. K. Rowling.',            
            // inputContext: '韓國瑜（1957年6月17日－），中華民國政治人物，中國國民黨籍，生於今新北市中和區，現任高雄市市長，中華民國陸軍軍官學校專修學生班40期、東吳大學英國語文學系文學學士、國立政治大學東亞研究所法學碩士[12]。 曾任第12屆臺北縣議員及三屆（第2－4屆）立法委員[13]。2001年角逐不分區立委失利[14] ；2004年在閃紅燈路口未停車禮讓而過失致死一名無駕照並且超速之重機騎士，被法院判處6個月徒刑得易科罰金，緩刑2年[15]；2004年在岳家雲林縣斗六市和妻子李佳芬創辦維多利亞雙語中小學；2005年，出任臺北縣中和市副市長1年8個月；2007年曾打算再戰國會，因黨內初選中指控對手張慶忠，被黨部取消初選資格[16]。2012年被指派擔任臺北農產運銷公司總經理。2016年9月辭職未成[17]，2017年因參選於1月辭職，3月離職，參選國民黨主席落敗[18][19][20]。 2017年9月，成為國民黨高雄市黨部主委。2018年4月遷籍高雄市林園區，5月在初選勝出並代表國民黨參選高雄市長，11月24日舉行的中華民國地方首長選舉以89萬2545票[21]、15萬多票差距擊敗民主進步黨候選人陳其邁而獲勝，結束民進黨在高雄市20年及原高雄縣33年的執政[22]。 2019年6月5日，韓國瑜就任高雄巿長162天，經過和徵詢小組對談後打破曾在高雄市長選前保證不會半途離職的承諾[23]，他表態願意被動徵召角逐國民黨總統初選[24]。8日於花蓮場2020總統參選造勢大會公開宣告已登記黨內初選[25]，後於初選時中出國民黨主席而參加2020年中華民國總統選舉。',
            floatPciked: false
        }
        this.t = props.t
        this.qaContext = React.createRef();
        this.pickedBlock = React.createRef();
        this.pickedBlockChilds = []
        this.handleScroll = this.handleScroll.bind(this)
        this.showToastInfo = showToastInfo
        this.submitBtn = React.createRef();
    }

    componentDidMount() {
        // console.log(this.props)        
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        //已選擇答案區塊不可見
        // console.log(((window.pageYOffset+window.innerHeight)>this.pickedBlock.current.offsetTop) === false)
        // console.log(window.pageYOffset+window.innerHeight,this.pickedBlock.current.offsetTop)
        // console.log("")
        if (((window.pageYOffset + window.innerHeight) > this.pickedBlock.current.offsetTop) === false) {
            this.setState({
                floatPciked: true
            })
        }
        else {
            this.setState({
                floatPciked: false
            })
        }
    }

    pasteTo() {
        let self = this
        navigator.clipboard.readText()
            .then(function (text) {
                console.log(text, this)
                self.setState({
                    inputContext: text
                })
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            })
    }

    confirmContext() {
        let { isEdit, inputContext } = this.state
        let { t } = this
        if (isEdit === true) {
            if (inputContext.length <= 0 || inputContext.replace(/ /g, "").length <= 0) {
                this.showToastInfo(t('Input can\'t be null'), 'error')
                return
            }
        }
        this.setState({
            isEdit: !isEdit
        })
        setTimeout(() => {
            this.handleScroll()
        }, 0)
    }

    cleanSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
    }

    addWords() {
        /* 獲取並存下高亮文字 */
        let selection = window.getSelection();
        let selectWord = selection.toString()

        var start = selection.anchorOffset;
        var end = selection.focusOffset - 1;
        var tmp = 0;
        if (end < start) {
            tmp = end
            end = start
            start = tmp
            start++
            end--
        }
        // console.log(start, end);

        //取前後內容
        let contextLimit = 467
        let contextForQG = ''
        let { inputContext, floatPciked } = this.state
        let padding = 0
        if (start <= 233) {
            contextForQG = inputContext.slice(0, contextLimit)
        }
        else {
            contextForQG = inputContext.slice(parseInt(start - contextLimit / 2), parseInt(start + contextLimit / 2))
            // console.log(contextForQG)
            padding = start - 234
            start = start - padding
            end = (end - padding)
        }
        
        // console.log(inputContext.slice(start+padding,end+1+padding))
        // console.log(contextForQG.slice(start,end+1))
        // console.log(start, end, padding,contextForQG.length);

        let { selectWords } = this.state
        let { t } = this

        //檢查重複
        let isWordRepeat = false
        selectWords.map((word) => {
            let { start_at, end_at } = word
            // console.log(start_at,start,padding)
            // console.log(end_at,end,padding)
            if (start_at === start && end_at === end 
                && selectWord === word.tag && padding === word.tag_padding) {
                isWordRepeat = true
            }
            return true
        })

        if (isWordRepeat) {
            this.cleanSelection()
            return
        }

        if (selectWord !== '' && selectWord.replace(/ /g, "").length > 0) {
            selectWords.push({
                tag_padding: padding,
                tag: selectWord,
                start_at: start,
                end_at: end,
                context: contextForQG //選取的標記附近文章
            })
            this.setState({
                selectWords,
            })
        }
        if (selectWords.length === 1) {
            this.showToastInfo(t('Click block to cancel select'))
        }
        this.cleanSelection()
        if (floatPciked) {
            console.log(this.submitBtn)
            setTimeout(() => { this.submitBtn.current.scrollIntoView({ block: 'end', behavior: 'smooth' }); }, 0)
        }
    }

    removeSelect(e, start, end, tag) {
        /* remove word by start_at */
        let { selectWords } = this.state
        selectWords = selectWords.filter((word) => {
            let { start_at, end_at } = word
            return !(start_at === start && end_at === end && tag === word.tag)
        })
        // console.log(selectWords)
        this.setState({
            selectWords
        })
    }

    submitQs() {
        let { selectWords, inputContext } = this.state
        let { dispatch, appState } = this.props
        if (selectWords.length > 0) {
            this.showToastInfo(this.t('Generating'))
            dispatch(SQs(selectWords, inputContext, appState.model))
        }
        else {
            this.showToastInfo(this.t('No answer is selected'), 'error')
        }
    }

    helpSelect() {
        this.showToastInfo(this.t('Drag to select word'))
    }

    helpSelected() {
        this.showToastInfo(this.t('Click block to cancel select'))
    }

    render() {
        // window.pageYOffset
        let { selectWords, isEdit, inputContext, oneClickDisable = false, floatPciked } = this.state
        let { t } = this
        let { model, selectWordsSubmitting } = this.props.appState
        return (
            <div id="QA-context">
                <h3 className="d-none">{isEdit === true ? t('Paste an article') : t('Select some words')}
                    <span
                        onClick={e => this.helpSelect(e)}
                        className='help-btn'
                    >
                        <MdHelp />
                    </span>
                </h3>
                <small className='small-text'><b>{model==='zh-TW'?(t('Model-zhTW')):(t('Model-enUS'))}</b> </small>
                <div className="w-100 text-center center" >
                <button
                    style={{
                        fontSize:'10px',                        
                    }}
                    onClick={() => {
                        window.location.reload()
                    }}
                    className="btn btn-sm btn-outline-danger">{t("clear all data")}  <MdRefresh /></button>
                </div>
                {/* <div className="btn-group">
                    {isEdit === true ? (
                        <button
                            className='btn btn-sm btn-dark'
                            onClick={e => this.pasteTo(e)}>{t('Paste from clipboard')} <MdContentCopy /></button>
                    ) : ('')}
                </div> */}                
                <div className="form-group" ref={this.qaContext}>
                    {isEdit === true ? (
                        <textarea
                            placeholder={t('Paste an Article here')}
                            onChange={e => {
                                let txt = e.target.value
                                this.setState({
                                    inputContext: txt
                                })
                            }}
                            value={inputContext}
                            className="form-control"
                            rows="7"
                        >
                        </textarea>
                    ) : (
                            <pre
                                className="qa-context"
                                onMouseUp={e => this.addWords(e)}
                                key={JSON.stringify(selectWords)}
                            >
                                {this.state.inputContext}
                            </pre>
                        )}

                </div>
                <div className="btn-group">
                    <button
                        onClick={(e) => {
                            if (!isEdit) {
                                if (!oneClickDisable) {
                                    this.showToastInfo(t('Double click to confirm'))
                                }
                                this.setState({
                                    oneClickDisable: true
                                })
                                setTimeout(() => {
                                    this.setState({
                                        oneClickDisable: false
                                    })
                                }, 3000)
                            }
                            else {
                                this.confirmContext(e)
                            }
                        }}
                        onDoubleClick={e => {
                            this.setState({
                                selectWords: []
                            })
                            this.confirmContext(e)
                        }}
                        className={isEdit ? 'btn btn-sm btn-success' : 'btn btn-sm btn-secondary'}>{isEdit ? (<span>{t('Confirm')} <MdLockOpen /></span>) : (<span>{t('Edit')} <MdLockOutline /></span>)}</button>
                </div>
                <br />
                <br />
                <div ref={this.pickedBlock} className="selected-block-container">
                    <div
                        className={floatPciked ? 'selected-block' : ''}>
                        <h4>{t('Selected Answer')}
                            <span
                                className='help-btn'
                                onClick={e => this.helpSelected(e)}
                            >
                                <MdHelp />
                            </span>
                        </h4>
                        {selectWords.map((word, k) => {
                            let { tag, start_at, end_at } = word
                            return (
                                <small
                                    ref={ele => { this.pickedBlockChilds[k] = ele }}
                                    className="btn btn-sm btn-danger select-margin"
                                    key={k}
                                    onClick={e => this.removeSelect(e, start_at, end_at, tag)}
                                >
                                    {tag}
                                </small>
                            )
                        })}
                        <br />
                        <br />
                        <button
                            ref={this.submitBtn}
                            className="btn btn-sm btn-success"
                            onClick={e => this.submitQs(e)}
                            disabled={selectWordsSubmitting}
                        >{t("Generate")}</button>
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        appState: state
    }
}

export default compose(connect(mapStateToProps), withTranslation())(View);