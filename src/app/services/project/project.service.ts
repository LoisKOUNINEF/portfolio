import { AppEventBus, CatalogItemConfig, I18nService, Service } from '../../../core/index.js';

export type ProjectConfigFolder = ProjectFolderName | CatalogItemConfig<ProjectFolderName>;
export type ProjectConfigObject = IProject | CatalogItemConfig<IProject>;

export class Project extends Service<Project> {
  public getProject(folderName: ProjectConfigFolder): ProjectConfigObject {
    return this.handleIndex(folderName);
  }

  public getProjectBatch(projectFolderNames: ProjectFolderName[]): ProjectConfigObject[] {
    return projectFolderNames.map((folderName: ProjectFolderName) => {
      return this.getProject(folderName);
    })
  }

  public parseFolderName(folderName: ProjectConfigFolder): ProjectFolderName {
    let parsedFolderName;

    if(typeof folderName !== 'string' && folderName.value) 
      parsedFolderName = folderName.value;
    else parsedFolderName = folderName;

    return parsedFolderName as ProjectFolderName;
  }

  private handleIndex(folderName: ProjectConfigFolder): ProjectConfigObject {
    const folder = this.parseFolderName(folderName);
    let project;
    if (
      typeof folderName !== 'string' 
      && 'index' in folderName
    ) {
      project = { 
        ...this.getTranslated(folder),
        index: folderName.index
      };
    } else {
       project = this.getTranslated(folder);
    }
    return project;
  }

  private getTranslated(projectFolderName: ProjectFolderName): IProject {
    const translated = I18nService.getTranslationObject<IProject>(`${projectFolderName}`);
    
    if (!translated) {
      throw new Error(`Project ${projectFolderName} not found`);
    }  
    return translated;
  }
}

export const ProjectService = Project.getInstance();
