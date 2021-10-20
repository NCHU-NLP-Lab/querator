import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import Slider from "react-animated-slider";
import { showTextSlider } from "../action";
import Button from "react-bootstrap/Button";
import "./index.css";
import p0 from "./gifs/0.png";
import step1Gif from "./gifs/step1.gif";
import step2Gif from "./gifs/step2.gif";
import step3Gif from "./gifs/step3.gif";

class TutorialBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderIndex: 0,
    };
  }
  render() {
    let { sliderIndex } = this.state;
    let { dispatch, t } = this.props;

    const content = [
      {
        title: t("A Powerful AI to Assist Question Generation"),
        description: (
          <div>
            <img width="95%" src={p0} alt="" srcSet="" />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://nlpnchu.org/querator"
            >
              Learn more about Qureator AI
            </a>
          </div>
        ),
      },
      {
        title: t("Step 1 - Paste an Article"),
        description: (
          <div style={{ paddingTop: "15px" }}>
            <img width="90%" src={step1Gif} alt="" srcSet="" />
          </div>
        ),
      },
      {
        title: t("Step 2 - Highlight Answers"),
        description: (
          <div style={{ paddingTop: "15px" }}>
            <img width="90%" src={step2Gif} alt="" srcSet="" />
          </div>
        ),
      },
      {
        title: t("Step 3 - Review Result"),
        description: (
          <div style={{ paddingTop: "15px" }}>
            <img width="90%" src={step3Gif} alt="" srcSet="" />
          </div>
        ),
      },
    ];

    const isLast = Boolean(sliderIndex === content.length - 1);

    return (
      <div id="T-Slider">
        <div className="slider-container text-center">
          <Slider
            key={sliderIndex}
            slideIndex={sliderIndex}
            infinite={false}
            duration={1000}
          >
            {content.map((article, index) => (
              <div key={index}>
                <h2>{article.title}</h2>
                <div>{article.description}</div>
              </div>
            ))}
          </Slider>
          <Button
            variant={isLast ? "success" : "primary"}
            size="lg"
            onClick={() => {
              this.setState((state) => {
                if (isLast) {
                  dispatch(showTextSlider(false));
                  window.localStorage.setItem(
                    "already_see_text_slider",
                    "already_see_text_slider"
                  );
                  return { sliderIndex: 0 };
                }
                return { sliderIndex: sliderIndex + 1 };
              });
            }}
          >
            {isLast ? t("Finish") : t("Next")}
            &nbsp;
            {`(${sliderIndex + 1}/${content.length})`}
          </Button>
        </div>
      </div>
    );
  }
}

export default compose(withTranslation(), connect())(TutorialBox);
