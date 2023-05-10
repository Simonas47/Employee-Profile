import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import React, { useState } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';

import MyProject from '../../models/MyProject.interface';
import { ProjectsService } from '../../services/projects.service';
import { UserStateRoot } from '../../store/types/user';
import ProjectStatusColor from '../projectProfiles/ProjectStatusColor';

type ProjectProfilesResultsProps = {
  myProjects: MyProject[];
  getProjects: () => void;
  filterStatus: string;
};

const MyProjectProfilesResults: React.FC<ProjectProfilesResultsProps> = (props: ProjectProfilesResultsProps) => {
  const { myProjects, getProjects, filterStatus } = props;
  const [response, setResponse] = useState();
  const userId = useSelector((state: UserStateRoot) => state.userState.value).id;
  const user = useSelector((state: UserStateRoot) => state.userState.value);
  const projectsService = new ProjectsService();

  const renderResultItem = (myProject: MyProject) => {
    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        const inputValue = event.currentTarget?.querySelector('input')?.value;
        if (!inputValue) return;
        const data = {
          projectId: Number(myProject.id),
          employeeId: Number(userId),
          responsibilities: inputValue,
        };
        try {
          const addResponsibilitiesToMyProject = await projectsService.setProjectEmployeeResponsibilities(data);
          setResponse(addResponsibilitiesToMyProject.data);
          getProjects();
        } catch (error) {
          console.error(error);
        }
      }
    };
    return (
      <div key={myProject.id}>
        <ListItem
          alignItems="flex-start"
          sx={{
            border: 1,
            borderColor: '#DDDDDD',
            borderRadius: 2,
            backgroundColor: 'white',
            mb: 1,
          }}
        >
          <Stack direction="row">
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{
                position: 'relative',
                width: 800,
                left: 0,
              }}
            >
              <Box
                display="flex"
                sx={{
                  border: 1,
                  borderColor: '#DDDDDD',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FolderIcon
                  sx={{
                    color: 'primary.main',
                    fontSize: 26,
                  }}
                />
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  width: 600,
                  left: 25,
                }}
              >
                <Typography
                  sx={{
                    color: '#666666',
                    fontSize: 14,
                    pt: 1,
                  }}
                >
                  <>
                    {'From '} {correctDateFormat(myProject.startDate)}
                    {myProject.endDate ? ' to ' + correctDateFormat(myProject.endDate) : ''}
                  </>
                </Typography>
                <Typography
                  sx={{
                    color: 'primary.main',
                    fontSize: 20,
                  }}
                >
                  {myProject.title}
                </Typography>
                <Typography
                  sx={{
                    color: '#666666',
                    fontSize: 14,
                    whiteSpace: 'pre-wrap',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '5',
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {myProject.description}
                </Typography>
                <Box>
                  <Box
                    component="div"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      my: 1,
                    }}
                  >
                    <InputLabel>
                      <Typography sx={{ fontSize: 16, fontWeight: 400, color: 'primary.main' }}>
                        My responsibilities
                      </Typography>
                    </InputLabel>
                    {myProject.responsibilities ? (
                      <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: 14, color: '#666666' }}>
                        {myProject.responsibilities}
                      </Typography>
                    ) : (
                      <TextField
                        hiddenLabel
                        variant="standard"
                        onKeyPress={handleKeyPress}
                        placeholder="Enter responsibilities..."
                        sx={{ color: 'primary.main' }}
                      />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      mt: 2,
                      mb: 2,
                      color: 'primary.main',
                      fontSize: 14,
                      height: 20,
                      fontWeight: 500,
                    }}
                  >
                    {user.title}
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{
                position: 'relative',
                width: 544,
                left: 0,
              }}
            >
              <ProjectStatusColor projectStatus={myProject.status} />
              <Box alignItems="flex-end" display="flex">
                <IconButton
                  className="btn-edit"
                  aria-label="edit"
                  sx={{
                    color: 'primary.main',
                    position: 'relative',
                    left: 320,
                    backgroundColor: '#F4F4F4',
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Box>
            </Stack>
          </Stack>
        </ListItem>
      </div>
    );
  };
  const correctDateFormat = (date: string) => {
    if (date === null) {
      return null;
    } else {
      return moment(date).format('YYYY/MM/DD');
    }
  };

  if (!myProjects.length) {
    return (
      <List
        sx={{
          width: '100%',
        }}
      >
        <ListItem alignItems="flex-start">
          <Typography
            sx={{
              color: 'primary.main',
              fontSize: 20,
            }}
          >
            {filterStatus === 'All'
              ? 'No projects added.'
              : `No '${filterStatus}' projects found. Check the filter settings.`}
          </Typography>
        </ListItem>
      </List>
    );
  } else {
    return (
      <>
        <List
          sx={{
            width: '100%',
          }}
        >
          {myProjects.map((myProject) => renderResultItem(myProject))}
        </List>
      </>
    );
  }
};

export default MyProjectProfilesResults;
