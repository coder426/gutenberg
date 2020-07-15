/**
 * Internal dependencies
 */
import {
	toggleFeature,
	setTemplate,
	addTemplate,
	removeTemplate,
	setTemplatePart,
	setPage,
	showHomepage,
	setHomeTemplateId,
} from '../actions';

describe( 'actions', () => {
	describe( 'toggleFeature', () => {
		it( 'should return TOGGLE_FEATURE action', () => {
			const feature = 'name';
			expect( toggleFeature( feature ) ).toEqual( {
				type: 'TOGGLE_FEATURE',
				feature,
			} );
		} );
	} );

	describe( 'setTemplate', () => {
		it( 'should return the SET_TEMPLATE action', () => {
			const templateId = 1;
			expect( setTemplate( templateId ) ).toEqual( {
				type: 'SET_TEMPLATE',
				templateId,
			} );
		} );
	} );

	describe( 'addTemplate', () => {
		it( 'should yield the DISPATCH control to create the template and return the SET_TEMPLATE action', () => {
			const template = { slug: 'index' };
			const newTemplate = { id: 1 };

			const it = addTemplate( template );
			expect( it.next().value ).toEqual( {
				type: 'DISPATCH',
				storeKey: 'core',
				actionName: 'saveEntityRecord',
				args: [ 'postType', 'wp_template', template ],
			} );
			expect( it.next( newTemplate ) ).toEqual( {
				value: {
					type: 'SET_TEMPLATE',
					templateId: newTemplate.id,
				},
				done: true,
			} );
		} );
	} );

	describe( 'removeTemplate', () => {
		it( 'should yield the API_FETCH control and yield the SELECT control to set the page by yielding the DISPATCH control for the SET_PAGE action', () => {
			const templateId = 1;
			const page = { path: '/' };

			const it = removeTemplate( templateId );
			expect( it.next().value ).toEqual( {
				type: 'API_FETCH',
				request: {
					path: `/wp/v2/templates/${ templateId }`,
					method: 'DELETE',
				},
			} );
			expect( it.next().value ).toEqual( {
				type: 'SELECT',
				storeKey: 'core/edit-site',
				selectorName: 'getPage',
				args: [],
			} );
			expect( it.next( page ).value ).toEqual( {
				type: 'DISPATCH',
				storeKey: 'core/edit-site',
				actionName: 'setPage',
				args: [ page ],
			} );
			expect( it.next().done ).toBe( true );
		} );
	} );

	describe( 'setTemplatePart', () => {
		it( 'should return the SET_TEMPLATE_PART action', () => {
			const templatePartId = 1;
			expect( setTemplatePart( templatePartId ) ).toEqual( {
				type: 'SET_TEMPLATE_PART',
				templatePartId,
			} );
		} );
	} );

	describe( 'setPage', () => {
		it( 'should yield the FIND_TEMPLATE control and return the SET_PAGE action', () => {
			const page = { path: '/' };
			const templateId = 1;

			const it = setPage( page );
			expect( it.next().value ).toEqual( {
				type: 'FIND_TEMPLATE',
				path: page.path,
			} );
			expect( it.next( templateId ) ).toEqual( {
				value: {
					type: 'SET_PAGE',
					page,
					templateId,
				},
				done: true,
			} );
		} );
	} );

	describe( 'showHomepage', () => {
		it( 'should calculate and set the homepage if it is set to show posts', () => {
			const templateId = 1;
			const path = '/';

			const it = showHomepage();
			expect( it.next().value ).toEqual( {
				type: 'FIND_TEMPLATE',
				path,
			} );

			expect( it.next( templateId ).value ).toEqual( {
				type: 'SET_HOME_TEMPLATE',
				homeTemplateId: templateId,
			} );

			expect( it.next().value ).toEqual( {
				args: [ 'root', 'site' ],
				selectorName: 'getEntityRecord',
				storeKey: 'core',
				type: 'SELECT',
			} );

			const page = {
				path,
				context: {},
			};
			expect( it.next( { show_on_front: 'posts' } ).value ).toEqual( {
				type: 'DISPATCH',
				storeKey: 'core/edit-site',
				actionName: 'setPage',
				args: [ page ],
			} );
			expect( it.next().done ).toBe( true );
		} );

		it( 'should calculate and set the homepage if it is set to show a page', () => {
			const templateId = 1;
			const path = '/';

			const it = showHomepage();
			expect( it.next().value ).toEqual( {
				type: 'FIND_TEMPLATE',
				path,
			} );

			expect( it.next( templateId ).value ).toEqual( {
				type: 'SET_HOME_TEMPLATE',
				homeTemplateId: templateId,
			} );

			expect( it.next().value ).toEqual( {
				args: [ 'root', 'site' ],
				selectorName: 'getEntityRecord',
				storeKey: 'core',
				type: 'SELECT',
			} );

			const page = {
				path,
				context: {
					postId: 2,
					postType: 'page',
				},
			};
			expect(
				it.next( { show_on_front: 'page', page_on_front: 2 } ).value
			).toEqual( {
				type: 'DISPATCH',
				storeKey: 'core/edit-site',
				actionName: 'setPage',
				args: [ page ],
			} );
			expect( it.next().done ).toBe( true );
		} );
	} );

	describe( 'setHomeTemplateId', () => {
		it( 'should return the SET_HOME_TEMPLATE action', () => {
			const homeTemplateId = 90;
			expect( setHomeTemplateId( homeTemplateId ) ).toEqual( {
				type: 'SET_HOME_TEMPLATE',
				homeTemplateId,
			} );
		} );
	} );
} );
