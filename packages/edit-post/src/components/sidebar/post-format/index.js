/**
 * WordPress dependencies
 */
import { PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	PostFormat as PostFormatForm,
	PostFormatCheck,
	PostFormatLabel,
} from '@wordpress/editor';
import { __, sprintf } from '@wordpress/i18n';

const PANEL_NAME = 'post-format';

const POST_FORMAT_TITLES = {
	aside: __( 'Aside' ),
	audio: __( 'Audio' ),
	chat: __( 'Chat' ),
	gallery: __( 'Gallery' ),
	image: __( 'Image' ),
	link: __( 'Link' ),
	quote: __( 'Quote' ),
	standard: __( 'Standard' ),
	status: __( 'Status' ),
	video: __( 'Video' ),
};

export default function PostFormat() {
	const { isOpened, isRemoved, showSuggestion, suggestedFormat } = useSelect(
		( select ) => {
			const { getEditedPostAttribute, getSuggestedPostFormat } = select(
				'core/editor'
			);
			const supportedFormats =
				select( 'core' ).getThemeSupports().formats ?? [];
			const suggestedPostFormat = getSuggestedPostFormat();

			// We use isEditorPanelRemoved to hide the panel if it was
			// programatically removed. We don't use isEditorPanelEnabled since
			// this panel should not be disabled through the UI.
			const { isEditorPanelRemoved, isEditorPanelOpened } = select(
				'core/edit-post'
			);

			return {
				isRemoved: isEditorPanelRemoved( PANEL_NAME ),
				isOpened: isEditorPanelOpened( PANEL_NAME ),
				showSuggestion:
					getEditedPostAttribute( 'format' ) !==
						suggestedPostFormat &&
					supportedFormats.includes( suggestedPostFormat ),
				suggestedFormat: suggestedPostFormat
					? POST_FORMAT_TITLES[ suggestedPostFormat ]
					: null,
			};
		},
		[]
	);

	const { toggleEditorPanelOpened } = useDispatch( 'core/edit-post' );

	if ( isRemoved ) {
		return null;
	}

	return (
		<PostFormatCheck>
			<PanelBody
				initialOpen={ false }
				opened={ isOpened }
				onToggle={ () => {
					toggleEditorPanelOpened( PANEL_NAME );
				} }
				title={ [
					__( 'Post format:' ),
					<span
						className="editor-post-publish-panel__link"
						key="label"
					>
						<PostFormatLabel />
					</span>,
				] }
			>
				<PostFormatForm />
				<p>
					{ __(
						'Your theme uses post formats to highlight different kinds of content, like images or videos. Apply a post format to see this special styling.'
					) }
				</p>
				{ showSuggestion && (
					<p>
						{ sprintf(
							/* translators: %s: post format */
							__( 'Suggested format: %1$s.' ),
							suggestedFormat
						) }
					</p>
				) }
			</PanelBody>
		</PostFormatCheck>
	);
}
