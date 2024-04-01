import Split from 'react-split';
import './split.css';

export function Splitter() {
  return (<Split
    className="split"
    style={{height: '100%'}}
  >
    <div>a</div>
    <div>b</div>
  </Split>);
}
