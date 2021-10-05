import React, { Component } from "react";
import Slider from "react-animated-slider";
import p0 from "./gifs/0.png";
import step1Gif from "./gifs/step1.gif";
import step2Gif from "./gifs/step2.gif";
import step3Gif from "./gifs/step3.gif";
// import 'react-animated-slider/build/horizontal.css';
import "./index.css";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { showTextSlider } from "../action";
class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderIndex: 0,
    };
  }
  render() {
    let { sliderIndex } = this.state;
    let { dispatch, t } = this.props;

    let content = [
      {
        title: (
          <h2 className="text-center">
            {t("A Powerful AI to Assist Question Generation")}
          </h2>
        ),
        description: (
          <div className="text-center" style={{ paddingTop: "60px" }}>
            <img width="95%" src={p0} alt="" srcSet="" />
            <br />
            <br />
            <br />
            <div className="text-center">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://udiclab.cs.nchu.edu.tw/querator.html"
              >
                Learn more with Qureator AI
              </a>
            </div>
          </div>
        ),
      },
      {
        title: (
          <h2 className="text-center">{t("Step 1 - Paste an Article")}</h2>
        ),
        description: (
          <div className="text-center" style={{ paddingTop: "15px" }}>
            <img width="90%" src={step1Gif} alt="" srcSet="" />
          </div>
        ),
      },
      {
        title: (
          <h2 className="text-center">{t("Step 2 - Highlight Answers")}</h2>
        ),
        description: (
          <div className="text-center" style={{ paddingTop: "15px" }}>
            <img width="90%" src={step2Gif} alt="" srcSet="" />
          </div>
        ),
      },
      {
        title: <h2 className="text-center">{t("Step 3 - Review Result")}</h2>,
        description: (
          <div className="text-center" style={{ paddingTop: "15px" }}>
            <img width="90%" src={step3Gif} alt="" srcSet="" />
          </div>
        ),
      },
    ];

    return (
      <div id="T-Slider">
        <div className="slider-container">
          <Slider
            key={sliderIndex}
            slideIndex={sliderIndex}
            infinite={false}
            duration={1000}
          >
            {content.map((article, index) => (
              <div key={index}>
                {article.title}
                <div>{article.description}</div>
              </div>
            ))}
          </Slider>
          <div className="text-center btns">
            <button
              onClick={() => {
                let { sliderIndex } = this.state;
                if (sliderIndex === 3) {
                  sliderIndex = -1;
                  //finish
                  dispatch(showTextSlider(false));
                  window.localStorage.setItem(
                    "already_see_text_slider",
                    "already_see_text_slider"
                  );
                }
                this.setState({
                  sliderIndex: sliderIndex + 1,
                });
              }}
              className={`btn ${
                sliderIndex === 3 ? "btn-success" : "btn-primary"
              } next-btn btn-block`}
            >
              {sliderIndex === 3 ? t("Finish") : t("Next")}&nbsp;
              {`(${sliderIndex + 1}/4)`}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(withTranslation(), connect())(View);
