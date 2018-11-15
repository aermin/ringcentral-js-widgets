
import FetchData from './fetchData';
import { BaseService } from 'ringcentral-e2e-cli';

export default class EinsteinServices extends BaseService {
  constructor(params) {
    super();
    this._fetchData = new FetchData(params);
  }

  async createCaseTemplate(externalId) {
    const caseDirectory = await this._fetchData.getCaseDirectory();
    console.log('caseDirectory', caseDirectory);
    const caseContent = await this._fetchData.getCaseByExternalId(externalId);
    console.log('caseContent', caseContent);
  }
}
