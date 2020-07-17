/**
 * WordPress dependencies
 */
import {
	DropdownMenu,
	Icon,
	__experimentalInputControl as InputControl,
	ToolbarButton,
	__experimentalToolbarItem as ToolbarItem,
	ToolbarGroup,
	Popover,
} from '@wordpress/components';
import {
	chevronDown as arrowDownIcon,
	check as checkIcon,
	link as linkIcon,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import {
	useEffect,
	useRef,
	useState,
	forwardRef,
	useMemo,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockControls from '../block-controls';
import LinkControlSearchInput from '../link-control/search-input';
import LinkControlSearchResults from '../link-control/search-results';
import useCreatePage from '../link-control/use-create-page';

export default function ToolbarLinkControl( {
	initialLink,
	createSuggestion,
	close,
	onChange,
} ) {
	const [ currentLink, setCurrentLink ] = useState( initialLink );
	const { opensInNewTab, rel } = currentLink;
	const [ editUrl, setEditUrl ] = useState( '' );
	const [ shouldShowSuggestions, setShouldShowSuggestions ] = useState(
		true
	);

	const updateCurrentLink = ( data ) => {
		setCurrentLink( {
			...currentLink,
			url: editUrl,
			...data,
		} );
	};

	useEffect( () => {
		setEditUrl( computeNiceURL( currentLink.url ) );
	}, [ currentLink ] );

	const inputRef = useRef();

	useEffect( () => {
		// eslint-disable-next-line @wordpress/react-no-unsafe-timeout
		setTimeout( () => {
			if ( inputRef.current ) {
				inputRef.current.focus();
			}
		} );
	}, [] );

	const finishLinkEditing = ( acceptChanges = true ) => {
		if ( acceptChanges ) {
			onChange( { ...currentLink, url: editUrl } );
		}
		close();
	};

	const { createPage, isCreatingPage, errorMessage } = useCreatePage(
		createSuggestion
	);

	const renderSuggestions = ( props ) => (
		<Popover focusOnMount={ false }>
			<LinkControlSearchResults { ...props } />
		</Popover>
	);

	const inputComponent = useMemo( () => {
		return forwardRef( ( props, ref ) => {
			return (
				<InputControl
					{ ...props }
					className="toolbar-link-control__input-control"
					ref={ ref }
					autoFocus={ false }
					onChange={ ( value, { event } ) => {
						setShouldShowSuggestions( true );
						props.onChange( event );
					} }
					prefix={
						<div className="toolbar-link-control__icon-wrapper">
							<Icon icon={ linkIcon } />
						</div>
					}
				/>
			);
		} );
	}, [] );

	return (
		<BlockControls __experimentalIsExpanded={ true }>
			<ToolbarGroup className="toolbar-link-control__input-group">
				<ToolbarItem ref={ inputRef }>
					{ ( toolbarItemProps ) => (
						<div
							{ ...toolbarItemProps }
							className="toolbar-link-control__input-wrapper"
						>
							<LinkControlSearchInput
								inputComponent={ inputComponent }
								currentLink={ currentLink }
								placeholder="Start typing"
								renderSuggestions={ renderSuggestions }
								value={ editUrl }
								onCreateSuggestion={ createPage }
								onChange={ setEditUrl }
								onSelect={ ( link ) => setCurrentLink( link ) }
								showInitialSuggestions={ false }
								allowDirectEntry
								showSuggestions={ shouldShowSuggestions }
								withCreateSuggestion
							/>
						</div>
					) }
				</ToolbarItem>
				<ToolbarItem>
					{ ( toolbarItemProps ) => (
						<DropdownMenu
							position="bottom"
							className="link-option"
							closeOnClick={ false }
							contentClassName="link-options__popover"
							icon={ arrowDownIcon }
							onToggle={ ( isOpen ) => {
								if ( isOpen ) {
									setShouldShowSuggestions( false );
								}
							} }
							toggleProps={ {
								...toolbarItemProps,
								name: 'link-options',
								title: __( 'Link options' ),
							} }
							controls={ [
								[
									{
										title: 'Remove link',
										onClick: ( closeMenu ) => {
											setEditUrl( '' );
											closeMenu();
										},
									},
									{
										title: (
											<>
												<span className="toolbar-link-control__toggle-menu-item-label">
													Open in new tab
												</span>
												{ opensInNewTab && (
													<Icon icon={ checkIcon } />
												) }
											</>
										),
										onClick: () => {
											updateCurrentLink( {
												opensInNewTab: ! opensInNewTab,
											} );
										},
									},
									{
										title: (
											<>
												<span className="toolbar-link-control__toggle-menu-item-label">
													Add nofollow attribute
												</span>
												{ rel === 'nofollow' && (
													<Icon icon={ checkIcon } />
												) }
											</>
										),
										onClick: () => {
											updateCurrentLink( {
												rel:
													currentLink.rel ===
													'nofollow'
														? ''
														: 'nofollow',
											} );
										},
									},
								],
							] }
						/>
					) }
				</ToolbarItem>
			</ToolbarGroup>
			<ToolbarGroup>
				<ToolbarButton
					name="done"
					title={ __( 'Done' ) }
					onClick={ () => finishLinkEditing( true ) }
				>
					Done
				</ToolbarButton>
			</ToolbarGroup>
		</BlockControls>
	);
}

export function computeNiceURL( url ) {
	if ( ! url ) {
		return '';
	}

	let urlData;
	try {
		urlData = new URL( url );
	} catch ( e ) {
		return url;
	}
	let displayUrl = '';

	const siteHost = document.location.host;
	if ( urlData.host && urlData.host !== siteHost ) {
		displayUrl += urlData.host;
	}
	displayUrl += urlData.pathname;
	if ( urlData.search ) {
		displayUrl += urlData.search;
	}
	return displayUrl;
}
