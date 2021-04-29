import React from 'react';
import { Admin as RaAdmin, AdminProps, Resource } from 'react-admin';
import localStorageDataProvider from 'ra-data-local-storage';
import { Create, Edit, List } from './builders';
import {
    useResourcesConfiguration,
    ResourceConfigurationProvider,
} from './ResourceConfiguration';
import { Layout, Ready } from './ui';
import { useApplication } from './ApplicationContext';

export const Admin = (props: Omit<AdminProps, 'dataProvider'>) => {
    const { application } = useApplication();
    if (!application) {
        return null;
    }
    const dataProvider = localStorageDataProvider({
        localStorageKey: `@@ra-no-code/${application.name}/data`,
    });
    return (
        <ResourceConfigurationProvider
            dataProvider={dataProvider}
            storageKey={`@@ra-no-code/${application.name}`}
        >
            <InnerAdmin
                {...props}
                title={application.name}
                dataProvider={dataProvider}
            />
        </ResourceConfigurationProvider>
    );
};

const InnerAdmin = (props: AdminProps) => {
    const [resources] = useResourcesConfiguration();
    const hasResources = !!resources && Object.keys(resources).length > 0;
    return (
        <RaAdmin ready={Ready} layout={Layout} {...props}>
            {hasResources
                ? Object.keys(resources).map(resource => (
                      <Resource
                          key={resource}
                          name={resource}
                          options={{ label: resources[resource].label }}
                          list={List}
                          edit={Edit}
                          create={Create}
                      />
                  ))
                : undefined}
        </RaAdmin>
    );
};
