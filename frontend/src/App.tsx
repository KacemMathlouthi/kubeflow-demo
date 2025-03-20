import './index.css';
import ImplementedFeatures from './components/implemented-features';
import UpcomingFeatures from './components/upcoming-features';
import RagDiagram from './components/RagDiagram';

function App() {
  return (    
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              Kubeflow Demo
            </h1>
            <p className="text-lg">
              A demo application showcasing the capabilities of Kubeflow
            </p>
          </div>
          <div className="mt-10">
            <UpcomingFeatures />
          </div>
          <div className="mt-10"> 
            <ImplementedFeatures />
          </div>
          <div className="mt-10"> 
            <RagDiagram />
          </div>
        </div>
  );
} 
export default App;
