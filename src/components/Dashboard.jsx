import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  DocumentTextIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '../components/ui/card';

function Dashboard({ project }) {
  const { t } = useTranslation();

  // Calculate statistics
  const characterCount = project.characters?.length || 0;
  const timelineCount = project.timelines?.length || 0;
  const scriptCount = project.scripts?.length || 0;
  
  // Calculate total events across all timelines
  const totalEvents = project.timelines?.reduce((acc, timeline) => {
    return acc + (timeline.events?.length || 0);
  }, 0) || 0;

  // Calculate average events per timeline
  const averageEventsPerTimeline = timelineCount > 0 ? Math.round(totalEvents / timelineCount) : 0;

  // Calculate relationships (assuming each character has a relationships array)
  const relationshipCount = project.characters?.reduce((acc, character) => {
    return acc + (character.relationships?.length || 0);
  }, 0) || 0;

  const stats = [
    {
      name: t('common.statistics.characters'),
      value: characterCount,
      icon: UsersIcon,
      color: 'text-blue-500'
    },
    {
      name: t('common.statistics.timelines'),
      value: timelineCount,
      icon: ClockIcon,
      color: 'text-green-500'
    },
    {
      name: t('common.statistics.events'),
      value: `${totalEvents} (${averageEventsPerTimeline}/${t('common.statistics.timelines')})`,
      icon: ChartBarIcon,
      color: 'text-purple-500'
    },
    {
      name: t('common.statistics.relationships'),
      value: relationshipCount,
      icon: ShareIcon,
      color: 'text-orange-500'
    },
    {
      name: t('common.statistics.scripts'),
      value: scriptCount,
      icon: DocumentTextIcon,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{project.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold mt-1">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;