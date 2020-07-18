/**
 * WordPress dependencies
 */
import {
	createNewPost,
	findSidebarPanelWithTitle,
} from '@wordpress/e2e-test-utils';

describe( 'Datepicker', () => {
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'should show the publishing date as "Immediately" if the date is not altered', async () => {
		const panelToggle = await findSidebarPanelWithTitle(
			'Publish:Immediately'
		);
		const publishingDate = panelToggle.textContent.substring(
			'Publish:'.length
		);

		expect( publishingDate ).toEqual( 'Immediately' );
	} );

	it( 'should show the publishing date if the date is in the past', async () => {
		// Open the datepicker.
		const panelToggle = await findSidebarPanelWithTitle(
			'Publish:Immediately'
		);
		await panelToggle.click();

		// Change the publishing date to a year in the past.
		await page.click( '.components-datetime__time-field-year' );
		await page.keyboard.press( 'ArrowDown' );

		// Close the datepicker.
		await panelToggle.click();

		const publishingDate = panelToggle.textContent.substring(
			'Publish:'.length
		);

		expect( publishingDate ).toMatch(
			/[A-Za-z]{3} \d{1,2}, \d{4} \d{1,2}:\d{2} [ap]m/
		);
	} );

	it( 'should show the publishing date if the date is in the future', async () => {
		// Open the datepicker.
		const panelToggle = await findSidebarPanelWithTitle(
			'Publish:Immediately'
		);
		await panelToggle.click();

		// Change the publishing date to a year in the future.
		await page.click( '.components-datetime__time-field-year' );
		await page.keyboard.press( 'ArrowUp' );

		// Close the datepicker.
		await panelToggle.click();

		const publishingDate = panelToggle.textContent.substring(
			'Publish:'.length
		);

		expect( publishingDate ).not.toEqual( 'Immediately' );
		// The expected date format will be "Sep 26, 2018 11:52 pm".
		expect( publishingDate ).toMatch(
			/[A-Za-z]{3} \d{1,2}, \d{4} \d{1,2}:\d{2} [ap]m/
		);
	} );

	it( 'should show the publishing date as "Immediately" if the date is cleared', async () => {
		// Open the datepicker.
		const panelToggle = await findSidebarPanelWithTitle(
			'Publish:Immediately'
		);
		await panelToggle.click();

		// Change the publishing date to a year in the future.
		await page.click( '.components-datetime__time-field-year' );
		await page.keyboard.press( 'ArrowUp' );

		// Close the datepicker.
		await panelToggle.click();

		// Open the datepicker.
		await panelToggle.click();

		// Clear the date.
		await page.click( '.components-datetime__date-reset-button' );

		const publishingDate = panelToggle.textContent.substring(
			'Publish:'.length
		);

		expect( publishingDate ).toEqual( 'Publish:Immediately' );
	} );
} );
