import React from 'react';
import * as d3 from 'd3';
import { SvgLoader, SvgProxy } from 'react-svgmt';
import './LotMap.css';
import lotMapUtils from './lotMapUtils';
import lotMapConfig from './lotMapConfig';

const basePath = `${process.env.REACT_APP_OAKWOOD_CDN}lotmaps/`

const LotMap = ({
  communityRID,
  lotData,
  selectedModelLotNumbers,
  windowWidth
}) => {

  const initD3 = () => {
    const svg = d3.select("#svg-main");

    const container = d3.select("#g-main");
    let bbox, vx, vy, vw, vh, defaultView;

    if (container.node() !== null) {
      bbox = container.node().getBBox();

      vx = bbox.x;		// container x co-ordinate
      vy = bbox.y;		// container y co-ordinate
      vw = bbox.width;	// container width
      vh = bbox.height;	// container height
      defaultView = vx + " " + vy + " " + vw + " " + vh;

      svg
        .attr("viewBox", defaultView)
        .attr("preserveAspectRatio", "xMidYMid meet");
    }
  }

  const generateProxyData = () => {
    const proxyData = [];
    lotData.forEach(lot => {
      // Define selector property
      const proxyObj = {};
      proxyObj.selector = `#_${lot.LotRID}`;
      // Define fill property
      const lotNum = parseInt(lot.LotID.split('-')[2]);
      const lotSelected = selectedModelLotNumbers.includes(lotNum);
      proxyObj.fill = lotSelected
        ? lotMapUtils.generateFillColor(lotMapConfig.displayColors, lot)
        : '#696969';

      proxyData.push(proxyObj);
    });

    return proxyData;
  }

  const listProxyElements = () => {
    const proxyData = generateProxyData();
    return proxyData.map(proxy =>
      <SvgProxy key={proxy.selector} selector={proxy.selector} fill={proxy.fill} />
    );
  }

  const isMobile = windowWidth <= 1015;
  const svgPath = 'https://s3-us-west-1.amazonaws.com/bimaire-american-dream-portal/lotmap/202/American_Dream_Topo_4K_AmericanDream_Topo.svg';

  return (
    <div className="LotMap">
      <div className="legend"></div>
      <svg id={`svg-main`} className={`${isMobile ? 'mobile' : ''}`}>
        <g id="g-main">
          <SvgLoader path={svgPath} onSVGReady={() => initD3()}>
            {listProxyElements()}
          </SvgLoader>
        </g>
      </svg>
    </div>
  )
}

export default LotMap;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// maps through array and find designated color
  static generateFillColor = (displayColors, lot) => {
      
    switch (lot.Status) {
      case 'Available':
        if (lot.Type === 'Model') {
          return displayColors.model;
        } else if (lot.Type === 'Market') {
          return displayColors.spec;
        } else {
          return displayColors.available;
        }
      case 'New':
        if (lot.Type === 'Model') {
          return displayColors.model;
        } else if (lot.Type === 'Market') {
          return displayColors.spec;
        } else {
          return displayColors.unavailable;
        }
      case 'Sold':
        if (lot.Type === 'Model') {
          return displayColors.model;
        } else if (lot.Type === 'Market') {
          return displayColors.spec;
        } else {
          return displayColors.sold;
        }
      default:
        console.log('lot status not listed', lot);
        return displayColors.model
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  const homesitesConfig = {  
       displayColors: {
          available: '#3e5582',
          spec: '#d9cc42',
          sold: '#ab634b',
          model: '#fff',
          unavailable: '#cbcbca',
          highlighted: '#a5b300'
      } 
  }
