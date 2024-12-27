<?php

class FavoredLogger {

    static public function write_log( $message ) {

		$pluginlog = FAVORED_BASE_PATH . 'debug.log';

		$date = new DateTime();
		$date = $date->format("Y-m-d h:i:s");

		$message = '[' . $date . '] ' . $message . PHP_EOL;

		$filesystem = new WP_Filesystem_Direct( true );

		if ( ! $filesystem->exists( $pluginlog ) ) {

			$filesystem->touch( $pluginlog );
			$filesystem->chmod( $pluginlog, 0666 );

		}

		$src = fopen( $pluginlog, 'r+' );
		$dest = fopen( 'php://temp', 'w' );

		fwrite( $dest, $message );

		stream_copy_to_stream( $src, $dest );
		rewind( $dest );
		rewind( $src );
		stream_copy_to_stream( $dest, $src );

		fclose( $src );
		fclose( $dest );

	}

	static public function read_log() {

		$pluginlog = FAVORED_BASE_PATH . 'debug.log';

		$filesystem = new WP_Filesystem_Direct( true );

		if ( ! $filesystem->is_readable( $pluginlog ) ) {
			return false;
		}

		return $filesystem->get_contents( $pluginlog );

	}
}
