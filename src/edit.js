/**
 * WordPress dependencies
 */
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { 
	useBlockProps, 
	RichText, 
	MediaPlaceholder, 
	BlockIcon, 
	BlockControls, 
	MediaReplaceFlow, 
	InspectorControls, 
	__experimentalImageSizeControl as ImageSizeControl 
} from '@wordpress/block-editor';
import { Spinner, withNotices, ToolbarButton, PanelBody, TextareaControl, ExternalLink } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { image as icon, wordpress } from '@wordpress/icons';


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
	const {image_id, image_url, image_alt, width, height, title, content} = attributes;

	const [ temporaryURL, setTemporaryURL ] = useState();
	
	const image = useSelect((select) => {
		const { getMedia } = select( 'core' );
		return image_id ? getMedia(image_id) : null;
	}, [image_id]);

	const imageStyle= {
		width, height
	}

	const onAltChange = (alt) => {
		setAttributes({image_alt: alt})
	}
	
	const onImageSelect = (media) => {
		if ( ! media || ! media.url ) {
			removeImage();
			return;
		}
		setAttributes({image_id: media.id, image_url: media.url, image_alt: media.alt});
	}
	const onTitleChange = (newTitle) => {
		setAttributes({title: newTitle});
	}
	const onContentChange = (newContent) => {
		setAttributes({content: newContent});
	}
	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}

	const removeImage = () => {
		setAttributes( {
			image_id: undefined,
			image_url: undefined,
			image_alt: '',
		} );
	}
	
	useEffect( () => {
		if ( isTemporaryImage(image_id, image_url) ) {
			removeImage();
			setTemporaryURL( image_url );
			return;
		} 
		revokeBlobURL( temporaryURL );
	}, [ image_url ] );

	return (
		<>
			{ image_url && !isBlobURL(image_url) &&
				<InspectorControls>
					<PanelBody title={__('Image Settings')}>		
						<TextareaControl
							label={__('Alt text (alternative text)')}
							value={image_alt}
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
				</InspectorControls>
			} 
			{ image_url &&
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__('Replace Image', 'jc-simple-blurb')}
						mediaId={image_id}
						mediaUrl={image_url}
						accept="image/*"
						allowedTypes={ ['image'] }
						onSelect={onImageSelect} 
						onSelectURL={(url) => {setAttributes({image_id: undefined, image_url: url, image_alt: ''})}}
						onError={onUploadError}
					/>
					<ToolbarButton 
						icon="trash"
						label={__('Remove Image', 'jc-simple-blurb')}
						onClick={removeImage}
					/>	
				</BlockControls>
			}
			<div {...useBlockProps()}>
				<div className={`jc-blurb-image${isBlobURL(image_url) ? ' is-image-loading' :''}`}>
					{ image_url && <img src={image_url} alt={image_alt} style={imageStyle}/> }
					{ isBlobURL(image_url) && <Spinner/> }
					<MediaPlaceholder 
						accept="image/*"
						allowedTypes={ ['image'] }
						icon={<BlockIcon icon={ icon }/>} 
						onSelect={onImageSelect} 
						onSelectURL={(url) => {setAttributes({image_id: undefined, image_url: url, image_alt: ''})}}
						onError={onUploadError}
						disableMediaButtons={ image_url }
						notices={ noticeUI }
					/>
				</div>
				<div className="jc-blurb-content">
					<RichText placeholder={__('Blurb Title', 'jc-simple-blurb')} tagName="h4" onChange={onTitleChange} value={title}/>
					<RichText placeholder={__('Blurb Content', 'jc-simple-blurb')} tagName="p" onChange={onContentChange} value={content}/>
				</div>
			</div>
		</>
	);
}

export default withNotices( Edit );
