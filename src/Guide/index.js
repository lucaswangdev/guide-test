import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './guide.css';

function getListFromLike(listLike) {
  if (!listLike) {
    return
  }
  var list = []

  for (var i = 0, len = listLike.length; i < len; i++) {
    list.push(listLike[i])
  }
  return list
}

function getWindowInfo() {
  return {
    winW: window.innerWidth,
    winH: window.innerHeight
  }
}

class Guide extends Component {
  static defaultProps = {
    visible: false,
    onCancel: function () {},
    onOk: function () {}
  }
  static propTypes = {
    children: PropTypes.any,
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
  }
  constructor (props) {
    super(props)
    this.nodeList = []
    this.dots = []
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
    const {dots, nodeList} = this._getMarkDomInfo()
    this.nodeList = nodeList
    this.dots = dots
    window.addEventListener('resize', this.onRezieWindow.bind(this), false)
    this._setTargetIndex(this.nodeList[0], 0)
    this._setDot(this.dots[0], 0,'start')
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onRezieWindow.bind(this), false)
  }
  // when resize window, change tooltip  position
  onRezieWindow () {
    const {dots} = this._getMarkDomInfo()
    let dot = dots[this.state.activeIndex]
    this.setState({
      tipStyle: this._getTipStyle(dot),
      contentStyle: dot,
      dots,
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
  _setDot (dot, newIndex, action) {
    let delay = action === 'start'?100:350
    this.setState({
      contentStyle: dot,
      tipStyle: {
        display: 'none',
        opacity: 0
      },
    })
    this._focusTarget(newIndex)
    var timer = setTimeout(() => {
      this.setState({
        tipStyle: this._getTipStyle(dot),
      })
      clearTimeout(timer)
    }, delay)
  }
  _getMarkDomInfo() {
    const nodeList = getListFromLike(this.guide.querySelectorAll('[data-step]'))
    nodeList.sort((a, b) => {
      return Number(a.getAttribute('data-step'))- Number(b.getAttribute('data-step'))
    })
    let dots = nodeList.map(node => {
      let height = node.clientHeight || node.offsetHeight
      let width = node.clientWidth || node.offsetWidth
      return {
        left: node.offsetLeft,
        top: node.offsetTop,
        height,
        width,
        step: node.getAttribute('data-step'),
        fRight: node.offsetLeft + width,
        fBottom: node.offsetTop + height
      }
    })
    return {dots, nodeList}
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
  _setTargetIndex (node, newIndex) {
    var timer = setTimeout(() => {
      node.style.setProperty('position', 'relative');
      node.style.setProperty('z-index', '999996', 'important');
      clearTimeout(timer)
    }, 300)
    if (newIndex !== this.state.activeIndex) {
      this._removeActive()
    }
  }

  // to change scroll to focus target
  _focusTarget(targetIndex) {
    var {winW, winH} = getWindowInfo()
    var {top, bottom, left, right} = this.nodeList[targetIndex].getBoundingClientRect()
    let dTop = this.dots[targetIndex].top
    let dLeft = this.dots[targetIndex].left
    let topBool = top > winH || top < 0 || bottom > winH
    let leftBool = left > winW || left < 0 || right > winW
    if (topBool || leftBool) {
      window.scrollTo(dLeft - 100, dTop - 100)
    }
  }
  // reomve active style
  _removeActive() {
    let lastNode = this.nodeList[this.state.activeIndex]
    if (lastNode) {
      lastNode.style.setProperty('position', '');
    }
  }
  // close guide
  _closeGuide (event) {
    this._removeActive()
    this.setState({
      activeIndex: 0
    })
    this.props.onCancel(event)
  }
  

  handleOk(event) {
    this.props.onOk(event)
  }
  render () {
      var guideNodes = [
        <div className="guide-shadow" ref={(e) =>  this.shadow = e} onClick={this.onClickShadow.bind(this)} key='guide-shadow'></div>,
        <div className="guide-content" key='guide-content' style={this.state.contentStyle} >
          <div className="guide-tooltip" style={this.state.tipStyle} >
            <div className={`guide-arrow ${this.state.arrowClass}`}></div>
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
