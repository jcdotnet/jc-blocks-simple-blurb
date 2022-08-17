/**
 * External dependencies
 */
 import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { 
	InnerBlocks,
	AlignmentControl,
	useBlockProps,
	MediaPlaceholder, 
	BlockIcon, 
	BlockControls, 
	MediaReplaceFlow, 
	InspectorControls, 
	__experimentalImageSizeControl as ImageSizeControl 
} from '@wordpress/block-editor';
import { Spinner, withNotices, ToolbarButton, PanelBody, TextareaControl, ExternalLink, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { image as icon } from '@wordpress/icons';


/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * Is the URL a temporary blob URL? A blob URL is one that is used temporarily
 * while the image is being uploaded and will not have an id yet allocated.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 *
 * @return {boolean} Is the URL a Blob URL
 */
 const isTemporaryImage = ( id, url ) => ! id && isBlobURL( url );

function Edit({attributes, setAttributes, noticeOperations, noticeUI}) { // we get the noticeOperations and the noticeUI props from the withNotices higher-order component
	const {imageId, imageUrl, alt, width, height, contentAlign, imageAlign, allowBlocks } = attributes;

	const [ temporaryURL, setTemporaryURL ] = useState();
	
	const image = useSelect((select) => {
		const { getMedia } = select( 'core' );
		return imageId ? getMedia(imageId) : null;
	}, [imageId]);

	const imageStyle= {
		width, height
	}
	const infoRef = useRef();

	const onAltChange = (alt) => {
		setAttributes({alt: alt})
	}

	function onAllowBlocksChange() {
		setAttributes( { allowBlocks: ! allowBlocks } );
	}
	
	const onImageSelect = (media) => {
		if ( ! media || ! media.url ) {
			removeImage();
			return;
		}
		setAttributes({imageId: media.id, imageUrl: media.url, alt: media.alt});
	}

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}

	const removeImage = () => {
		setAttributes( {
			imageId: undefined,
			imageUrl: undefined,
			alt: '',
		} );
	}
	
	useEffect( () => {
		if ( isTemporaryImage(imageId, imageUrl) ) {
			removeImage();
			setTemporaryURL( imageUrl );
			return;
		} else if (imageUrl) infoRef.current.getElementsByClassName('jc-blurb-title')[0].focus();
		
		revokeBlobURL( temporaryURL );
	}, [ imageUrl ] );

	return (
		<>
			<InspectorControls>					
				<PanelBody title={ __( 'Blurb Settings' ) }>
					<ToggleControl
						label={ __( 'Allow inserting new blocks' ) }
						checked={ !! allowBlocks }
						onChange={ onAllowBlocksChange }
					/>
				</PanelBody>
				{ imageUrl && !isBlobURL(imageUrl) &&
					<PanelBody title={__('Image Settings')}>		
						<TextareaControl
							label={__('Alt text (alternative text)')}
							value={alt}
							onChange={onAltChange}
							help={
								<>
									<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
										{ __(
											'Describe the purpose of the image'
										) }
									</ExternalLink>
									{ __(
										'Leave empty if the image is purely decorative.'
									) }
								</>
							}
						/>
						<ImageSizeControl
							onChange={ ( value ) => setAttributes( value ) }
							width={ width }
							height={ height }
							imageWidth={ (image && image.media_details && image.media_details.width) || undefined } 
							imageHeight={ (image && image.media_details && image.media_details.height) || undefined }
						/>			
					</PanelBody>
				}
			</InspectorControls>
		
			<BlockControls group="block">
				<AlignmentControl
					value={ contentAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { contentAlign: nextAlign } );
					} }
				/>
			</BlockControls> 
			{ imageUrl &&
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__('Replace Image', 'jc-simple-blurb')}
						mediaId={imageId}
						mediaUrl={imageUrl}
						accept="image/*"
						allowedTypes={ ['image'] }
						onSelect={onImageSelect} 
						onSelectURL={(url) => {setAttributes({imageId: undefined, imageUrl: url, alt: ''})}}
						onError={onUploadError}
					/>
					<ToolbarButton 
						icon="trash"
						label={__('Remove Image', 'jc-simple-blurb')}
						onClick={removeImage}
					/>
					<AlignmentControl
						value={ imageAlign }
						onChange={ ( nextAlign ) => {
							setAttributes( { imageAlign: nextAlign } );
						} }
					/>	
				</BlockControls>
			}
			<div {...useBlockProps()}>
				<div className={classnames( 'jc-blurb-content', {[ `has-content-align-${ contentAlign }` ]: contentAlign}, {[ `has-text-align-${ imageAlign }` ]: imageAlign})}>
					<div className={`jc-blurb-image${isBlobURL(imageUrl) ? ' is-image-loading' :''}`}>
						{ imageUrl && <img src={imageUrl} alt={alt} style={imageStyle}/> }
						{ isBlobURL(imageUrl) && <Spinner/> }
						<MediaPlaceholder 
							accept="image/*"
							allowedTypes={ ['image'] }
							icon={<BlockIcon icon={ icon }/>} 
							onSelect={onImageSelect} 
							onSelectURL={(url) => {setAttributes({imageId: undefined, imageUrl: url, alt: ''})}}
							onError={onUploadError}
							disableMediaButtons={ imageUrl }
							notices={ noticeUI }
						/>
					</div>
					<div className="jc-blurb-info" ref={infoRef}>
						<InnerBlocks
							templateLock ={ allowBlocks ? false : 'all' }
							template ={ [
								['core/heading', {
									className:"jc-blurb-title",
									level: 4,
									placeholder: __('Blurb Title', 'jc-simple-blurb')
									}],
								['core/paragraph', {
									className:"jc-blurb-description",
									placeholder: __('Blurb Content', 'jc-simple-blurb')
								}]
							] }
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default withNotices( Edit );
