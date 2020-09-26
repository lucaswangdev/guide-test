import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './guide.css';

function getWindowInfo() {
  return {
    winW: window.innerWidth,
    winH: window.innerHeight
  }
}

class Guide extends Component {
  static defaultProps = {
    id: '',
    visible: false,
    onCancel: function () {},
    onOk: function () {}
  }
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.any,
    content: PropTypes.any,
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.node = ''
    this.dot = ''
    this.state = {
      activeIndex: 0,
      contentStyle: {},
      tipStyle: {},
      // arrowClass: 'top',
      arrowClass: 'right',
      // arrowClass: 'bottom',
      // arrowClass: 'left',
    }
  }
  componentDidMount () {
    const {dot, node} = this._getMarkDomInfo()
    this.node = node
    this.dot = dot
    window.addEventListener('resize', this.onRezieWindow.bind(this), false)
    this._setTargetIndex(this.node, 0)
    this._setDot(this.dot, 0,'start')
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onRezieWindow.bind(this), false)
  }
  // when resize window, change tooltip  position
  onRezieWindow () {
    const {dot} = this._getMarkDomInfo()
    this.setState({
      tipStyle: this._getTipStyle(dot),
      contentStyle: dot,
      dot,
    })
  }
  // click shadow
  onClickShadow (event) {
    // if (event.target.className ==='guide-shadow') {
    //   this.shadow.removeEventListener('click',this.onClickShadow.bind(this), false)
    //   this._closeGuide(event)
    // }
  }

  // to set some params according to dot
  _setDot (dot, action) {
    let delay = action === 'start'?100:350
    this.setState({
      contentStyle: dot,
      tipStyle: {
        display: 'none',
        opacity: 0
      },
    })
    this._focusTarget()
    var timer = setTimeout(() => {
      this.setState({
        tipStyle: this._getTipStyle(dot),
      })
      clearTimeout(timer)
    }, delay)
  }

  
  _getMarkDomInfo() {
    const node = this.guide.querySelector('#step1');
    let height = node.clientHeight || node.offsetHeight
    let width = node.clientWidth || node.offsetWidth
    let dot = {
        left: node.offsetLeft,
        top: node.offsetTop,
        height,
        width,
        fRight: node.offsetLeft + width,
        fBottom: node.offsetTop + height
    }
    return {dot, node}
  }

  // tooltip style
  _getTipStyle (dot) {
    var {winH, winW} = getWindowInfo()
    var gap = 12
    var arrowClass = ''
    var tipObj = {opacity: 1}
    if (winH - dot.fBottom > 250 && winW - dot.left > 250) {
      arrowClass= 'top'
      tipObj = {top: dot.height + gap, left: 0}
    } else if (dot.top > 250  && winW - dot.left > 250) {
      arrowClass = 'bottom'
      tipObj = {bottom: dot.height + gap, left: 0}
    } else if (dot.left > 250 && winH - dot.top > 250 || dot.left > winW) {
      arrowClass= 'right'
      tipObj =  {top: 0, right: dot.width + gap}
    } else if (winW - dot.fRight > 250  && winH - dot.top > 250) {
      arrowClass = 'left'
      tipObj = {top: 0, left: dot.width+ gap}
    }  else {
      tipObj = {display: 'none'}
    }
    this.setState({
      arrowClass
    })
    return tipObj
  }

  // active target content style
  _setTargetIndex (node) {
    var timer = setTimeout(() => {
      node.style.setProperty('position', 'relative');
      node.style.setProperty('z-index', '999996', 'important');
      clearTimeout(timer)
    }, 300)
  }

  // to change scroll to focus target
  _focusTarget() {
    var {winW, winH} = getWindowInfo()
    var {top, bottom, left, right} = this.node.getBoundingClientRect()
    let dTop = this.dot.top
    let dLeft = this.dot.left
    let topBool = top > winH || top < 0 || bottom > winH
    let leftBool = left > winW || left < 0 || right > winW
    if (topBool || leftBool) {
      window.scrollTo(dLeft - 100, dTop - 100)
    }
  }
  // reomve active style
  _removeActive() {
    this.node.style.setProperty('position', '');
  }
  // close guide
  _closeGuide (event) {
    this._removeActive()
    this.props.onCancel(event)
  }
  

  handleOk(event) {
    this.props.onOk(event)
  }
  render () {
      var guideNodes = [
        <div className="guide-shadow" ref={(e) => this.shadow = e} onClick={this.onClickShadow.bind(this)} key='guide-shadow'></div>,
        <div className="guide-content" key='guide-content' style={this.state.contentStyle} >
          <div className="guide-tooltip" style={this.state.tipStyle} >
            <div className={`guide-arrow ${this.state.arrowClass}`}></div>
            {this.props.content}
          </div>
        </div>
      ]
      return (
        <div className="guide-container" ref={(e) => this.guide = e}>
          {this.props.children}
          {this.props.visible&&guideNodes}
        </div>
      )
  }
}

export default Guide
