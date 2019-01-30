import { NgModule } from '@angular/core';
import { PointFormatPipe } from './point-format.pipe';
import { SrcToUrlPipe } from './src-to-url.pipe';
import { ProgressFormatPipe } from './progress-format.pipe';
import { ByteFormatPipe } from './byte-format.pipe';
import { FloorPipe } from './floor.pipe';

@NgModule({
    imports: [],
    declarations: [PointFormatPipe, SrcToUrlPipe, ProgressFormatPipe, ByteFormatPipe, FloorPipe],
    exports: [PointFormatPipe, SrcToUrlPipe, ProgressFormatPipe, ByteFormatPipe, FloorPipe]
})
export class SharedPipesModule { }
