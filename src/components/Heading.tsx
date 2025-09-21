import React from "react";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center = false }) => {
  return (
    <div className={`space-y-2 ${center ? 'text-center' : ''}`}>
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Heading;
