import Database from "../database.js";

export default class TicketWorker {
    constructor() {
        //init database
        this.database = new Database();
        this.database.initialization();
    }

    getRouteControl(req, res) {
        const params = req.query;

        if(!params.method) {
            res.status(404).send('method is not exist!');
        }

        switch(params.method) {
            case 'allTickets':
                this._callbackRequest(async () => {
                    const tikets = await this.database.sequelize.models.Ticket.findAll();
                    res.json(tikets);
                });
                break;
            case 'ticketById':
                this._callbackRequest(async () => {
                    if(!params.id) {
                        res.status(404).send('id is not exist!');
                    }

                    const tiket = await this.database.sequelize.models.Ticket.findByPk(params.id);
                    res.json(tiket);
                });
                break;
            case 'deleteById':
                this._callbackRequest(async () => {
                    if(!params.id) {
                        res.status(404).send('id is not exist!');
                    }

                    const removeTiket = await this.database.sequelize.models.Ticket.destroy({
                        where: {
                            id: params.id,
                        },
                    });

                    if(!removeTiket) {
                        res.status(404).send('tiket is not exist!');
                    }

                    res.status(204).json(removeTiket);
                  
                });
                break;
            default:
                res.status(404).send('method is not exist!');
                break;

        }
    }

    postRouteControl(req, res) {
        const params = req.query;
        const reqestBody = req.body;

        if(!params.method) {
            res.status(404).send('method is not exist!');
        }

        switch(params.method) {
            case 'createTicket':
                this._callbackRequest(async () => {
                    if(!reqestBody.name) {
                        res.status(404).send('name is not exist!');
                    }

                    if(!reqestBody.description) {
                        res.status(404).send('description is not exist!');
                    }

                
                    const newTiket = await this.database.sequelize.models.Ticket.create({
                        name: reqestBody.name,
                        description: reqestBody.description
                    });
                    res.json(newTiket);
                });
                break;
            case 'updateById':
                this._callbackRequest(async () => {
                    if(!params.id) {
                        res.status(404).send('id is not exist!');
                    }

                    const updateFields = {};

                    if(reqestBody.name) {
                        updateFields.name = reqestBody.name;
                    }

                    if(reqestBody.description) {
                        updateFields.description = reqestBody.description;
                    }

                    if(reqestBody.status) {
                        updateFields.status = reqestBody.status;
                    }

                    if(Object.keys(updateFields).length === 0) {
                        res.status(404).send('Fields for updating the Ticket are not specified!');
                    }

                    const updateTiket = await this.database.sequelize.models.Ticket.update(updateFields, {
                        where: {
                            id: params.id,
                        },
                    });
                    
                    res.json(updateTiket);
                });
                break;
            default:
                res.status(404).send('method is not exist!');
                break;

        }

    }

    async _callbackRequest(callback) {
        return await callback();
    }
}