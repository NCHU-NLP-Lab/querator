import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import './index.css'
import { MdClose } from "react-icons/md";
import { showSetting, settingLngAndModel } from '../action'
import { compose } from 'redux'
import { connect } from 'react-redux'

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.t = this.props.t
        this.changeLang.bind(this)
    }

    changeLang(lang) {
        this.props.i18n.changeLanguage(lang);
        this.props.dispatch(settingLngAndModel(lang,'NULL'))
    }

    render() {
        let { dispatch, appState } = this.props
        let { t } = this
        let { lng, model } = appState
        return (
            <div id="AppConfig">
                <div className="menu">
                    <div className="card" >
                        <h3 className="text-center">{t('setting')}</h3>
                        <div className="card-body">
                            <h5 className="card-title">{t('UI lang')} :<b> {lng}</b></h5>
                            <p className="card-text">{t('Select UI lang')}</p>
                            <button 
                                onClick={() => this.changeLang('zh-TW')}
                                className="btn btn-primary">繁體中文</button>
                            <button 
                                onClick={() => this.changeLang('en-US')}
                                className="btn btn-primary">English</button>
                            <hr />
                            <h5 className="card-title">{t('QG model traget lang')}: <b>{model}</b></h5>
                            <p className="card-text">{t('Select Model lang')}</p>
                            <button
                                onClick={()=> dispatch(settingLngAndModel('NULL','zh-TW'))}
                                className="btn btn-primary">{t('Chinese')}</button>
                            <button 
                                onClick={()=> dispatch(settingLngAndModel('NULL','en-US'))}
                                className="btn btn-primary">{t('English')}</button>
                            <hr />
                            <h5 className="card-title">{t('Clear data and sign out')}</h5>
                            <p className="card-text">{t('Clear data and sign out')}</p>
                            <button
                                onClick={()=>{
                                    window.localStorage.clear()
                                    window.location.reload()
                                }}
                                className="btn btn-primary">{t('Comfirm')}</button>
                        </div>
                        <button
                            onClick={() => dispatch(showSetting(false))}
                            className="btn btn-danger float-right">Close <MdClose />
                        </button>
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

export default compose(withTranslation(), connect(mapStateToProps))(Index);