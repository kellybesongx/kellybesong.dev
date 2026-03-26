import React, { Suspense } from 'react';
import { componentRegistry } from './registry';

interface DynamicRendererProps {
 componentName: string;
 props?: any;
}

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ componentName, props }) => {
 const Component = componentRegistry[componentName];
 if (!Component) return <div>Component "{componentName}" not found.</div>;

 return (
   <Suspense fallback={<div>Loading...</div>}>
     <Component {...props} />
   </Suspense>
 );
};
