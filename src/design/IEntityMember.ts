import {EntityMemberType, DataFieldType} from '@/assets/js/EntityMemberType';

export interface IEntityMember {
    readonly ID: number;
    AllowNull: boolean;
    Comment: string;
    Name: string;
    Type: EntityMemberType;
    DataType: DataFieldType;
    Length?: number;
    Decimals?: number;
}
