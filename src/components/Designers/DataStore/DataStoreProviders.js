import AliOSS from './BlobStore/AliOSSStore'

/** 数据存储的提供者 */
export default {
    providers: [
        [{ title: 'PostgreSQL', provider: 'AppBox.Server.PostgreSQL;AppBox.Server.PgSqlStore', designer: null }],
        [{ title: 'Cassandra', provider: 'AppBox.Server.Cassandra;AppBox.Server.CassandraTableStore', designer: null }],
        [{ title: '阿里云OSS', provider: 'AppBox.Server.AliOSS;AppBox.Server.AliOSSStore', designer: AliOSS }],
        [{ title: 'Redis', provider: 'AppBox.Server.Redis;AppBox.Server.RedisCacheStore', designer: null }],
        [{ title: 'ElasticSearch', provider: 'AppBox.Server.ElasticSearch;AppBox.Server.ElasticSearchStore', designer: null }]
    ],

    /** 根据存储类型及Provider获取相应的设计器 */
    getDesigner(node) {
        var ps = this.providers[node.StoreType]
        for (var i = 0; i < ps.length; i++) {
            var p = ps[i]
            if (p.provider === node.Provider) {
                return p.designer
            }
        }

        return null
    }
}