import "react-animated-slider/build/horizontal.css";

import "./index.css";

import { showTextSlider } from "util/action";

import React, { Component } from "react";
import Slider from "react-animated-slider";
import Button from "react-bootstrap/Button";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";

import p0 from "./gifs/0.png";
import step1Gif from "./gifs/step1.gif";
import step2Gif from "./gifs/step2.gif";
import step3Gif from "./gifs/step3.gif";

class TutorialModal extends Component {
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
        image: p0,
      },
      {
        title: t("Step 1 - Paste an Article"),
        image: step1Gif,
      },
      {
        title: t("Step 2 - Highlight Answers"),
        image: step2Gif,
      },
      {
        title: t("Step 3 - Review Result"),
        image: step3Gif,
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
            {content.map((slide, index) => (
              <div key={index}>
                <h2>{slide.title}</h2>
                <div>
                  <img width="90%" src={slide.image} alt="" srcSet="" />
                </div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://nlpnchu.org/querator"
                >
                  Learn more about Qureator AI
                </a>
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
                return { sliderIndex: state.sliderIndex + 1 };
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

export default compose(withTranslation(), connect())(TutorialModal);
