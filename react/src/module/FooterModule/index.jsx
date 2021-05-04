import React, { Component } from 'react';
import './index.css'
import { IoIosPin } from "react-icons/io";
import { MdCall } from "react-icons/md";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div id="Footer">
                <div className="text-center container">
                    <span style={{
                        display:'block',
                        marginTop:'12px'
                    }}></span>
                    <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href="http://udiclab.cs.nchu.edu.tw/querator.html"
                        className="footer-text">
                        <span className="giticon">Querator AI</span>
                    </a>
                    <hr />
                    <div className="f-small">
                        <a
                            rel="noopener noreferrer"
                            target="_blank"
                            href="http://udiclab.cs.nchu.edu.tw"
                            className="footer-text">
                        <small><IoIosPin /> 中興大學，理學大樓720室 UDIC LAB</small>
                        <br />
                        <small><MdCall /> 04-22840497轉720</small>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;