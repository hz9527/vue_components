var normalList = [
  {
    flex: 2,
    className: 'year',
    defaultIndex: 7,
    list: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]
  },
  {
    flex: 1,
    content: '<span>-</span>'
  },
  {
    flex: 2,
    defaultIndex: 1,
    list: [
      {
        name: '一月',
        value: 0
      },
      {
        name: '二月',
        value: 1
      },
      {
        name: '三月',
        value: 2
      },
      {
        name: '四月',
        value: 3
      },
      {
        name: '五月',
        value: 4
      },
      {
        name: '六月',
        value: 5
      },
      {
        name: '七月',
        value: 6
      },
      {
        name: '八月',
        value: 7
      },
      {
        name: '九月',
        value: 8
      },
      {
        name: '十月',
        value: 9
      },
      {
        name: '十一月',
        value: 10
      },
      {
        name: '十二月',
        value: 11
      }
    ]
  }
]
var numList = [
  {
    flex: 2,
    defaultIndex: 1,
    list: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  },
  {
    flex: 1,
    content: '--'
  },
  {
    flex: 2,
    list: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  }
]
var childList = [
  {
    flex: 1,
    name: 'sheng',
    parentName: null,
    defaultIndex: 1,
    data: [
      {
        parent: null,
        list: [
          {
            name: '北京',
            value: '1'
          },
          {
            name: '湖北',
            value: '2'
          },
          {
            name: '陕西',
            value: '3'
          }
        ]
      }
    ]
  },
  {
    className: 'test',
    flex: 1,
    content: '-'
  },
  {
    flex: 1,
    name: 'shi',
    parentName: 'sheng',
    defaultIndex: 0,
    data: [
      {
        defaultIndex: 1,
        parent: '1',
        list: [
          {
            name: '海淀',
            value: '1-1'
          },
          {
            name: '朝阳',
            value: '1-2'
          },
          {
            name: '昌平',
            value: '1-3'
          },
          {
            name: '西城',
            value: '1-4'
          }
        ]
      },
      {
        parent: '2',
        list: [
          {
            name: '武汉',
            value: '2-1'
          },
          {
            name: '荆州',
            value: '2-2'
          },
          {
            name: '黄冈',
            value: '2-3'
          },
          {
            name: '黄石',
            value: '2-4'
          }
        ]
      },
      {
        defaultIndex: 1,
        parent: '3',
        list: ['西安', '安康', '汉中', '宝鸡']
      }
    ]
  },
  {
    className: 'test',
    flex: 1,
    content: '-'
  },
  {
    flex: 1,
    name: '',
    parentName: 'shi',
    data: [
      {
        parent: ['1-1', '1-2', '1-3', '1-4'],
        list: []
      },
      {
        parent: '2-1',
        list: ['武昌', '洪山', '汉阳', '新洲', '江岸', '硚口']
      },
      {
        parent: '2-2',
        list: ['荆州1区', '荆州2区', '荆州3区', '荆州4区']
      },
      {
        parent: '2-3',
        list: ['黄冈1区', '黄冈2区', '黄冈3区', '黄冈4区']
      },
      {
        parent: '2-4',
        list: ['黄石1区', '黄石2区', '黄石3区', '黄石4区']
      },
      {
        parent: '西安',
        list: ['西安1区', '西安2区', '西安3区', '西安4区']
      },
      {
        parent: '安康',
        list: ['安康1区', '安康2区', '安康3区', '安康4区']
      },
      {
        parent: '汉中',
        list: ['汉中1区', '汉中2区', '汉中3区', '汉中4区']
      },
      {
        parent: '宝鸡',
        list: ['宝鸡1区', '宝鸡2区', '宝鸡3区']
      }
    ]
  }
]
var multiChildList = [
  {
    flex: 2,
    name: 'sheng',
    parentName: null,
    data: [
      {
        parent: null,
        list: ['北京', '湖北', '陕西']
      }
    ]
  },
  {
    flex: 1,
    content: '-'
  },
  {
    flex: 2,
    name: 'shi',
    parentName: 'sheng',
    data: [
      {
        parent: '北京',
        list: ['朝阳', '海淀', '东城', '西城']
      },
      {
        parent: '湖北',
        list: ['武汉', '鄂州', '黄石', '宜昌', '襄阳']
      },
      {
        parent: '陕西',
        list: ['西安', '宝鸡', '安康']
      }
    ]
  },
  {
    flex: 1,
    content: '至'
  },
  {
    flex: 2,
    name: 'sheng2',
    parentName: null,
    data: [
      {
        parent: null,
        list: ['北京', '湖北', '陕西']
      }
    ]
  },
  {
    flex: 1,
    content: '-'
  },
  {
    flex: 2,
    name: 'shi2',
    parentName: 'sheng2',
    data: [
      {
        parent: '北京',
        list: ['朝阳', '海淀', '东城', '西城']
      },
      {
        parent: '湖北',
        list: ['武汉', '鄂州', '黄石', '宜昌', '襄阳']
      },
      {
        parent: '陕西',
        list: ['西安', '宝鸡', '安康']
      }
    ]
  }
]
var hybridList = [
  {
    flex: 2,
    name: 'sheng',
    parentName: null,
    data: [
      {
        parent: null,
        list: ['北京', '湖北', '陕西']
      }
    ]
  },
  {
    flex: 1,
    content: '-'
  },
  {
    flex: 2,
    parentName: 'sheng',
    data: [
      {
        parent: '北京',
        list: ['朝阳', '海淀', '东城', '西城']
      },
      {
        parent: '湖北',
        list: ['武汉', '鄂州', '黄石', '宜昌', '襄阳']
      },
      {
        parent: '陕西',
        list: ['西安', '宝鸡', '安康']
      }
    ]
  },
  {
    flex: 2,
    content: '时间：'
  },
  {
    flex: 2,
    list: [2011, 2012, 2013, 2014, 2015, 2016, 2017]
  },
  {
    flex: 1,
    content: '/'
  },
  {
    flex: 2,
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }
]
export {normalList, numList, childList, multiChildList, hybridList}
