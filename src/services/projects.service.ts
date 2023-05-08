import { FormikValues } from 'formik';
import { useSelector } from 'react-redux/es/hooks/useSelector';

import { ProjectStatus } from '../components/enums/ProjectStatus';
import MyProject from '../models/MyProject.interface';
import MyProjectEmployee from '../models/MyProjectEmployee.interface';
import Project from '../models/Project.interface';
import { UserStateRoot } from '../store/types/user';
import axios from './axios';

export class ProjectsService {
  userId = useSelector((state: UserStateRoot) => state.userState.value).id;

  public async getAllProjects() {
    const response = await axios.get('/project/all', {});
    response.data.map((project: Project) => {
      this.mapProjectStatus(project);
    });
    return response.data;
  }

  public async createProject(project: FormikValues) {
    const response = await axios.post('/project', {
      ...project,
    });
    return response.data;
  }

  public async updateProject(project: FormikValues) {
    const response = await axios.put('/project', {
      ...project,
    });
    return response.data;
  }

  public async deleteProjectById(id: number) {
    await axios.patch(`/project/delete/${id}`, {});
  }

  private mapProjectStatus(project: Project) {
    const today = new Date();
    const startDateFormatted = new Date(project.startDate);
    const endDateFormatted = new Date(project.endDate);

    if (startDateFormatted > today) {
      project.status = ProjectStatus.FUTURE;
    } else {
      if (project.endDate === null || endDateFormatted > today) {
        project.status = ProjectStatus.ONGOING;
      } else {
        project.status = ProjectStatus.FINISHED;
      }
    }
  }

  private mapMyProjectStatus(myProject: MyProject) {
    const today = new Date();
    const startDateFormatted = myProject.startDate ? new Date(myProject.startDate) : undefined;
    const endDateFormatted = myProject.endDate ? new Date(myProject.endDate) : undefined;

    if (startDateFormatted && startDateFormatted > today) {
      myProject.status = ProjectStatus.FUTURE;
    } else {
      if (!endDateFormatted || endDateFormatted > today) {
        myProject.status = ProjectStatus.ONGOING;
      } else {
        myProject.status = ProjectStatus.FINISHED;
      }
    }
  }

  public async getMyProjects() {
    const response = await axios.get(`/project/getProjectEmployeeBy/${this.userId}`);
    response.data.map((myProject: MyProject) => {
      this.mapMyProjectStatus(myProject);
    });
    return response.data;
  }

  public async updateProject2(myProject: FormikValues) {
    const response = await axios.post('project/addResponsibilitiesToProjectEmployee', {
      ...myProject,
    });
    return response.data;
  }

  public async getResponsibilitiesFromProjectEmployee(projectId: number) {
    const response = await axios.get(`project/responsibilities/${projectId}/${this.userId}`);
    const plainText = response.data;
    const responsibilities = plainText.split('\n').filter((line: string) => line.trim() !== '');
    return responsibilities;
  }

  public async addResponsibilitiesToProjectEmployee(myProjectEmployee: MyProjectEmployee) {
    const { projectId, employeeId, responsibilities } = myProjectEmployee;
    const data = {
      projectId: projectId,
      employeeId: employeeId,
      responsibilities: responsibilities,
    };
    const response = await axios.post('project/addResponsibilitiesToProjectEmployee', data);
    return response.data;
  }
}
