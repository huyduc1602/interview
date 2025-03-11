import React from 'react';
import { Link } from 'react-router-dom';
import ArrowRight from '@/components/icons/ArrowRight';

interface FeatureCardProps {
    to: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    action: string;
    bgColor: string;
    iconColor: string;
    textColor: string;
    hoverTextColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    to,
    icon,
    title,
    description,
    action,
    bgColor,
    iconColor,
    textColor,
    hoverTextColor
}) => {
    return (
        <Link
            to={to}
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
        >
            <div className="flex items-start gap-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor}`}>
                    <div className={`h-6 w-6 ${iconColor}`}>{icon}</div>
                </div>
                <div className="flex flex-col justify-between flex-1">
                    <div className="space-y-2">
                        <h3 className={`text-2xl font-semibold ${textColor}`}>
                            {title}
                        </h3>
                        <p className="text-gray-600">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
            <div className={`flex items-center ${hoverTextColor} mt-4`}>
                {action}
                <ArrowRight className="ml-2 h-4 w-4" />
            </div>
        </Link>
    );
};

export default FeatureCard;