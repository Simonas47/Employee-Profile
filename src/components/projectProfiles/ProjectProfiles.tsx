import React, {useEffect, useState} from 'react';
import './ProjectProfiles.scss';
import ProjectProfilesResult from './ProjectProfilesResults';
import ProjectsResult from '../../models/ProjectProfilesResult.interface';
import {ProjectsService} from '../../services/projects.service';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const ProjectProfiles = () => {
    const [results, setResults] = useState<ProjectsResult[]>([]);

    const projectsService = new ProjectsService();

    useEffect(() => {
        getResults();
    }, []);

    const getResults = async () => {
        const result = await projectsService.getAllProjects();
        setResults(result);
    };

    return (
        <div className='project-profiles-container'>
            <Box display='flex'
                 justifyContent='flex-end'
                 sx={{
                     position: 'relative',
                     my: 0.25,
                     width: 1344,
                     left: -200,
                 }}>
                <Button type='submit'
                        variant='contained'
                        id='addNewProject'
                        sx={{
                            my: 1,
                        }}>
                    Add new project
                </Button>
            </Box>
            <Box sx={{
                position: 'relative',
                my: 2,
                width: 1344,
                left: -200,
            }}>
                <ProjectProfilesResult results={results}/>
            </Box>
        </div>
    );
};

export default ProjectProfiles;