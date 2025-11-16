import { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, Card, Row, Col, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './App.css';

const { Option } = Select;

function App() {
  const [topText, setTopText] = useState('SUSAN & MAX');
  const [bottomText, setBottomText] = useState('LAKE TAHOE');
  const [centerImage, setCenterImage] = useState('tahoe');
  const [svgContent, setSvgContent] = useState('');
  const svgRef = useRef(null);

  // Load the base SVG template
  useEffect(() => {
    fetch('/template.svg')
      .then(response => response.text())
      .then(data => setSvgContent(data));
  }, []);

  // Function to create text on a circular path
  const createArcText = (text, pathId, textId, radius, startAngle, isTop) => {
    const centerX = 167.07;
    const centerY = 217.07;

    // Create circular path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    if (isTop) {
      // Top arc (upside down)
      const startX = centerX + radius * Math.cos((startAngle) * Math.PI / 180);
      const startY = centerY + radius * Math.sin((startAngle) * Math.PI / 180);
      const endX = centerX + radius * Math.cos((180 - startAngle) * Math.PI / 180);
      const endY = centerY + radius * Math.sin((180 - startAngle) * Math.PI / 180);

      path.setAttribute('d', `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`);
    } else {
      // Bottom arc
      const startX = centerX + radius * Math.cos((180 + startAngle) * Math.PI / 180);
      const startY = centerY + radius * Math.sin((180 + startAngle) * Math.PI / 180);
      const endX = centerX + radius * Math.cos((360 - startAngle) * Math.PI / 180);
      const endY = centerY + radius * Math.sin((360 - startAngle) * Math.PI / 180);

      path.setAttribute('d', `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`);
    }

    path.setAttribute('id', pathId);
    path.setAttribute('fill', 'none');

    // Create text element
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('id', textId);
    textElement.setAttribute('font-family', 'Arial, sans-serif');
    textElement.setAttribute('font-size', '16');
    textElement.setAttribute('font-weight', 'bold');
    textElement.setAttribute('fill', '#e30613');  // Match the red stroke color from original SVG
    textElement.setAttribute('stroke', '#e30613');
    textElement.setAttribute('stroke-width', '0.5');

    const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`);
    textPath.setAttribute('startOffset', '50%');
    textPath.setAttribute('text-anchor', 'middle');
    textPath.textContent = text;

    textElement.appendChild(textPath);

    return { path, textElement };
  };

  // Function to get center SVG content
  const getCenterSvgContent = () => {
    if (centerImage === 'tahoe') {
      // Simple Lake Tahoe shape
      return `<ellipse cx="167.07" cy="217.07" rx="50" ry="35" fill="none" stroke="#000000" stroke-width="2"/>
              <text x="167.07" y="222.07" text-anchor="middle" font-size="12" fill="#000000">TAHOE</text>`;
    } else if (centerImage === 'heart') {
      // Simple heart shape
      return `<path d="M 167.07 230 C 167.07 230, 147.07 200, 147.07 217.07 C 147.07 205, 167.07 205, 167.07 217.07 C 167.07 205, 187.07 205, 187.07 217.07 C 187.07 200, 167.07 230, 167.07 230 Z" fill="none" stroke="#000000" stroke-width="2"/>`;
    } else if (centerImage === 'star') {
      // Simple star shape
      return `<path d="M 167.07 190 L 175 210 L 195 210 L 180 222 L 187 242 L 167.07 230 L 147 242 L 154 222 L 139 210 L 159 210 Z" fill="none" stroke="#000000" stroke-width="2"/>`;
    }
    return '';
  };

  // Update SVG when inputs change
  useEffect(() => {
    if (!svgContent || !svgRef.current) return;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');

    // Check for parsing errors
    const parserError = svgDoc.querySelector('parsererror');
    if (parserError) {
      console.error('SVG parsing error:', parserError.textContent);
      return;
    }

    const svg = svgDoc.documentElement;

    // Check if it's a valid SVG element
    if (!svg || svg.nodeName !== 'svg') {
      console.error('Invalid SVG element');
      return;
    }

    // Remove existing custom elements
    svg.querySelectorAll('[id^="customPath"], [id^="customText"], [id^="centerCustom"]').forEach(el => el.remove());

    // Hide the original text paths (SUSAN & MAX at top, LAKE TAHOE at bottom)
    // The text is in <g> elements - there are two <g> groups with path elements containing text
    const textGroups = svg.querySelectorAll('g');
    textGroups.forEach(g => {
      g.style.display = 'none';
    });

    // Add defs if not exists
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }

    // Add top text arc - positioned on outer rim where original text was
    if (topText) {
      const { path: topPath, textElement: topTextElement } = createArcText(
        topText,
        'customPathTop',
        'customTextTop',
        135,  // Adjusted radius to fit within the ornament
        30,   // Arc angle
        true
      );
      defs.appendChild(topPath);
      svg.appendChild(topTextElement);
    }

    // Add bottom text arc - positioned on outer rim where original text was
    if (bottomText) {
      const { path: bottomPath, textElement: bottomTextElement } = createArcText(
        bottomText,
        'customPathBottom',
        'customTextBottom',
        135,  // Adjusted radius to fit within the ornament
        30,   // Arc angle
        false
      );
      defs.appendChild(bottomPath);
      svg.appendChild(bottomTextElement);
    }

    // Add center image
    const centerContent = getCenterSvgContent();
    if (centerContent) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('id', 'centerCustom');
      g.innerHTML = centerContent;
      svg.appendChild(g);
    }

    // Update the display - import the node into the current document
    svgRef.current.innerHTML = '';
    const importedSvg = document.importNode(svg, true);
    svgRef.current.appendChild(importedSvg);
  }, [topText, bottomText, centerImage, svgContent]);

  // Download SVG
  const downloadSvg = () => {
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-ornament.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px', color: '#fff' }}>
        Ornament Customizer for Laser Cutting
      </h1>

      <Row gutter={24} style={{ width: '100%', margin: 0 }}>
        <Col xs={24} lg={8}>
          <Card title="Customize Your Ornament">
            <Form layout="vertical">
              <Form.Item label="Top Text (Arc)">
                <Input
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text"
                  maxLength={30}
                />
              </Form.Item>

              <Form.Item label="Bottom Text (Arc)">
                <Input
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom text"
                  maxLength={30}
                />
              </Form.Item>

              <Form.Item label="Center Image">
                <Select value={centerImage} onChange={setCenterImage}>
                  <Option value="tahoe">Lake Tahoe</Option>
                  <Option value="heart">Heart</Option>
                  <Option value="star">Star</Option>
                  <Option value="none">None</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={downloadSvg}
                    size="large"
                  >
                    Download SVG
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Preview">
            <div
              ref={svgRef}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '500px',
                backgroundColor: '#fff',
                padding: '20px'
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default App;
