import {
    getBdaysList,
    deleteBday,
    addBday,
    editBday,
    getTemplatesList,
    addTemplate,
    deleteTemplate,
    getTemplate,
    editTemplate,
    getTemplateWithBday,
    getToken,
    addUser,
    getChannelsList,
    getBday,
    getSchedule,
} from "../api";

class CalendarService {
    fetchListOfBdays() {
        return getBdaysList().then(res => res.data);
    }

    fetchBday(id) {
        return getBday(id).then(res => res.data);
    }

    deleteBday(id) {
        return deleteBday(id);
    }

    addBday(data) {
        return addBday(data);
    }

    editBday(id, data) {
        return editBday(id, data);
    }

    fetchSchedule() {
        return getSchedule().then(res => res.data);
    }

    /////////////
    fetchListOfChannels() {
        return getChannelsList().then(res => res.data);
    }

    /////////////

    fetchListOfTemplates() {
        return getTemplatesList().then(res => res.data);
    }

    addTemplate(data) {
        return addTemplate(data);
    }

    deleteTemplate(id) {
        return deleteTemplate(id);
    }

    fetchTemplate(id) {
        return getTemplate(id).then(res => res.data);
    }

    editTemplate(id, data) {
        return editTemplate(id, data);
    }

    getTemplateWithBday(templateId, bdayId) {
        return getTemplateWithBday(templateId, bdayId).then(res => res.data);
    }

    ////////////////
    logIn(data) {
        return getToken(data);
    }

    addUser(data) {
        return addUser(data).then(res => res.data);
    }

}

export default new CalendarService();
