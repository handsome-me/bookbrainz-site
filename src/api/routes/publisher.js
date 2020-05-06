/*
 * Copyright (C) 2019  Akhilesh Kumar
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import * as _ from 'lodash';
import * as utils from '../helpers/utils';
import {
	formatQueryParameters,
	loadEntityRelationshipsForBrowse,
	validateBrowseRequestQueryParameters
} from '../helpers/middleware';
import {
	getEntityAliases,
	getEntityIdentifiers,
	getEntityRelationships,
	getPublisherBasicInfo
} from '../helpers/formatEntityData';
import {Router} from 'express';
import {makeEntityLoader} from '../helpers/entityLoader';


const router = Router();

const publisherBasicRelations = [
	'defaultAlias.language',
	'disambiguation',
	'publisherType',
	'area'
];

const publisherError = 'Publisher not found';

/**
 *@swagger
 *definitions:
 *  PublisherDetail:
 *    type: object
 *    properties:
 *      bbid:
 *        type: string
 *        format: uuid
 *        example: 'e418874e-5684-4fe9-9d2d-1b7e5d43fd59'
 *      area:
 *        type: string
 *        example: 'India'
 *      beginDate:
 *        type: string
 *        example: '1943'
 *      defaultAlias:
 *        $ref: '#/definitions/Alias'
 *      disambiguation:
 *        type: string
 *        example: 'Bharati Bhawan'
 *      endDate:
 *        type: string
 *        example:
 *      ended:
 *        type: boolean
 *        example: false
 *      type:
 *        type: string
 *        example: 'Publisher'
 *  BrowsedPublishers:
 *   type: object
 *   properties:
 *     bbid:
 *       type: string
 *       format: uuid
 *       example: 'f94d74ce-c748-4130-8d59-38b290af8af3'
 *     relatedPublishers:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           entity:
 *             $ref: '#/definitions/PublisherDetail'
 *           relationships:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                  relationshipTypeID:
 *                    type: number
 *                    example: 4
 *                  relationshipType:
 *                    type: string
 *                    example: 'Publisher'
 */


/**
 *
 *@swagger
 * '/publisher/{bbid}':
 *    get:
 *      tags:
 *        - Lookup Requests
 *      summary: Lookup Publisher by BBID
 *      description: Returns the basic details of the Publisher
 *      operationId: getPublisherByBbid
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: bbid
 *          in: path
 *          description: BBID of the Publisher
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: Basic information of the Publisher entity
 *          schema:
 *              $ref: '#/definitions/PublisherDetail'
 *        404:
 *          description: Publisher not found
 *        406:
 *          description: Invalid BBID
 */

router.get('/:bbid',
	makeEntityLoader('Publisher', publisherBasicRelations, publisherError),
	async (req, res) => {
		const publisherBasicInfo = await getPublisherBasicInfo(res.locals.entity);
		return res.status(200).send(publisherBasicInfo);
	});

/**
 *@swagger
 *  '/publisher/{bbid}/aliases':
 *    get:
 *      tags:
 *        - Lookup Requests
 *      summary: Get list of aliases of the Publisher by BBID
 *      description: Returns the list of aliases of the Publisher
 *      operationId: getAliasesOfPublisherByBbid
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: bbid
 *          in: path
 *          description: BBID of the Publisher
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: List of aliases with BBID of the Publisher
 *          schema:
 *              $ref: '#/definitions/Aliases'
 *        404:
 *          description: Publisher not found
 *        406:
 *          description: Invalid BBID
 */
router.get('/:bbid/aliases',
	makeEntityLoader('Publisher', utils.aliasesRelations, publisherError),
	async (req, res, next) => {
		const publisherAliasesList = await getEntityAliases(res.locals.entity);
		return res.status(200).send(publisherAliasesList);
	});

/**
 *	@swagger
 * '/publisher/{bbid}/identifiers':
 *   get:
 *     tags:
 *       - Lookup Requests
 *     summary: Get list of identifiers of the Publisher by BBID
 *     description: Returns the list of identifiers of the Publisher
 *     operationId: getIdentifiersOfPublisherByBbid
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: bbid
 *         in: path
 *         description: BBID of the Publisher
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: List of identifiers with BBID of the Publisher entity
 *         schema:
 *             $ref: '#/definitions/Identifiers'
 *       404:
 *         description: Publisher not found
 *       406:
 *         description: Invalid BBID
 */

router.get('/:bbid/identifiers',
	makeEntityLoader('Publisher', utils.identifiersRelations, publisherError),
	async (req, res, next) => {
		const publisherIdentifiersList = await getEntityIdentifiers(res.locals.entity);
		return res.status(200).send(publisherIdentifiersList);
	});

/**
 *	@swagger
 * '/publisher/{bbid}/relationships':
 *   get:
 *     tags:
 *       - Lookup Requests
 *     summary: Get list of relationships of the Publisher by BBID
 *     description: Returns the list of relationships of the Publisher
 *     operationId: getRelationshipsOfPublisherByBbid
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: bbid
 *         in: path
 *         description: BBID of the Publisher
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: List of relationships with BBID of the Publisher entity
 *         schema:
 *             $ref: '#/definitions/Relationships'
 *       404:
 *         description: Publisher not found
 *       406:
 *         description: Invalid BBID
 */

router.get('/:bbid/relationships',
	makeEntityLoader('Publisher', utils.relationshipsRelations, publisherError),
	async (req, res, next) => {
		const publisherRelationshipList = await getEntityRelationships(res.locals.entity);
		return res.status(200).send(publisherRelationshipList);
	});

/**
 *	@swagger
 * '/publisher':
 *   get:
 *     tags:
 *       - Browse Requests
 *     summary: Get list of Publishers which are related to an Edition or Work
 *     description: Returns the list of Publishers, When one of the bbid of Work or Edition is passed as query parameter
 *     operationId: getRelatedPublisherByBbid
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: work
 *         in: query
 *         description: BBID of the Work
 *         required: false
 *         type: bbid
 *       - name: edition
 *         in: query
 *         description: BBID of the Edition
 *         required: false
 *         type: bbid
 *     responses:
 *       200:
 *         description: List of Publisher with relationships which are related to either Work or Edition
 *         schema:
 *             $ref: '#/definitions/BrowsedPublishers'
 *       404:
 *         description: Work not found or Edition not found
 *       406:
 *         description: Invalid BBID paased in query params
 */

router.get('/',
	formatQueryParameters(),
	validateBrowseRequestQueryParameters(['author', 'edition', 'work', 'publisher']),
	makeEntityLoader(null, utils.relationshipsRelations, 'Entity not found', true),
	loadEntityRelationshipsForBrowse(),
	async (req, res, next) => {
		function relationshipsFilterMethod(relatedEntity) {
			if (req.query.type) {
				const publisherTypeMatched = _.toLower(relatedEntity.publisherType) === _.toLower(req.query.type);
				if (req.query.area) {
					const publisherAreaMatched = _.toLower(relatedEntity.area) === _.toLower(req.query.area);
					return publisherTypeMatched && publisherAreaMatched;
				}
				return publisherTypeMatched;
			}
			else if (req.query.area) {
				const publisherAreaMatched = _.toLower(relatedEntity.area) === _.toLower(req.query.area);
				return publisherAreaMatched;
			}
			return true;
		}

		const publisherRelationshipList = await utils.getBrowsedRelationships(
			req.app.locals.orm, res.locals, 'Publisher',
			getPublisherBasicInfo, publisherBasicRelations, relationshipsFilterMethod
		);

		if (req.query.modelType === 'Edition') {
			const {Edition} = req.app.locals.orm;
			const {bbid} = req.query;
			const relationships = publisherBasicRelations.map(rel => `publisherSet.publishers.${rel}`);
			const edition = await new Edition({bbid}).fetch({
				withRelated: relationships
			});
			const editionJSON = edition.toJSON();
			const {publishers} = editionJSON.publisherSet;
			publishers.map(publisher => getPublisherBasicInfo(publisher))
				.filter(relationshipsFilterMethod)
				.forEach((filteredEdition) => {
					// added relationship to make the output consistent
					publisherRelationshipList.push({entity: filteredEdition, relationship: {}});
				});
		}
		return res.status(200).send({
			bbid: req.query.bbid,
			publishers: publisherRelationshipList
		});
	});

export default router;
